import { Knex } from 'knex';
import { UserType } from '../interfaces';
import {  BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../exceptions';
import { PAYSTACK_SECRET_KEY } from '../config';
import { Paystack } from 'paystack-sdk';
import { Transfer } from 'paystack-sdk/dist/transfer/transfer';


export default class PaymentService {
  private db: Knex;
  private paystack: Paystack;
  private transfer: Transfer;

  constructor(db: Knex) {
    this.db = db;
    this.paystack = new Paystack(PAYSTACK_SECRET_KEY);
    this.transfer = new Transfer(PAYSTACK_SECRET_KEY)
  }

  async pay(userId: number, amount: number, reference: string): Promise<UserType> {
    const user = await this.db('usersTable').where({ id: userId }).first();

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const transaction :any = await this.paystack.transaction.initialize({
      amount: (amount * 100).toString(), // Paystack requires amount to be in kobo (i.e. smallest currency unit)
      email: user.email,
      reference,
    });
    return {
      ...user,
      wallet: user.wallet + amount,
      transactionId: transaction.data.reference,
    };
  }

  async withdraw(userId: number, amount: number): Promise<UserType> {
    const user = await this.db('usersTable').where({ id: userId }).first();

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.wallet < amount) {
      throw new UnauthorizedError('Insufficient funds');
    }

    const transaction:any = await this.paystack.transfer.initiate({
      source: 'balance', // Withdraw from the Paystack balance
      amount: amount * 100, // Paystack requires amount to be in kobo (i.e. smallest currency unit)
      recipient: user.email,
      reference: `withdrawal-${Date.now()}`,
    });

    return {
      ...user,
      wallet: user.wallet - amount,
      transactionId: transaction.data.transfer_code,
    };
  }

 async fund(userId: number, amount: number): Promise<UserType> {
  if (!Number.isInteger(userId) || userId < 1) {
    throw new BadRequestError('Invalid user ID');
  }

  if (!Number.isInteger(amount) || amount < 1) {
    throw new BadRequestError('Invalid amount');
  }

  const user = await this.db('usersTable').where({ id: userId }).first();

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const transaction: any = await this.paystack.transaction.initialize({
    amount: (amount * 100).toString(), // Paystack requires amount to be in kobo (i.e. smallest currency unit)
    email: user.email,
    reference: `lendsqr-pay-${Date.now()}`,
  });

  await this.db('usersTable').where({ id: userId })
    .update({ wallet: user.wallet + amount });

  delete(user.password)

  return {
    ...user,
    wallet: user.wallet,
    transactionId: transaction.data.reference,
  };
}

async initTransfer(senderId: number, receiverId: number, amount: number): Promise<any> {
    const sender = await this.db('usersTable').where({ id: senderId }).first();

    if (!sender) {
      throw new ConflictError('Sender not found');
    }
    const receiver = await this.db('usersTable').where({ id: receiverId }).first();

    if (!receiver) {
      throw new ConflictError('Receiver not found');
    }
    if (sender.wallet < amount) {
      throw new BadRequestError('Insufficient funds');
    }

    const transfer: any = await this.transfer.initiate({
      source: 'balance',
      reason:"We rise by lifting others",
      amount: amount * 100, // Paystack requires amount to be in kobo (i.e. smallest currency unit)
      recipient: receiver.email,
      reference: `lendsqr-transfer-${Date.now()}`,
    });
  if (transfer.status) {
      await Promise.all([
        this.db('usersTable').where({ id: senderId }).update({ wallet: sender.wallet - amount }),
        this.db('usersTable').where({ id: receiverId }).update({ wallet: receiver.wallet + amount }),
      ]);

      return {
        senderId: sender.id,
        receiverId: receiver.id,
        amount: amount,
        transferId: transfer.data.reference,
      };
    }
  return transfer
    
}
  
async completeTransfer(transferCode: string, otp: string): Promise<any> {
    try {
      const transfer = await this.transfer.finalize(transferCode,otp);
      return transfer;
    } catch (error:any) {
      throw new Error(error.message);
    }
  }
}


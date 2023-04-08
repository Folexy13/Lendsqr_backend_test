import { Knex } from 'knex';
import { IAccountNameEnqury, IPaymentInitializeRequest, IPaymentInitializeResponse, IPaymentTransferRequest, IPaymentResponse, IPaystackBank, IPaystackResolveAccount, IUserType } from '../interfaces';
import {  BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../exceptions';
import { PaystackApi } from '../api';
import { numToString } from '../utils';


export default class TransactionService {
  private db: Knex;
  private api :PaystackApi

  constructor(db: Knex) {
    this.db = db;
    this.api = new PaystackApi()
  }
  async getAll(): Promise<IUserType[]> {
    return await this.db('transactions').select('*');
  }
  async getBankList(query: string): Promise<IPaystackBank[]>{
     const baseURL = `/bank?country=${query}`
    try {
      const response: any = await this.api.get(baseURL)
       if( !response && response.status !== 200 ){
        throw new BadRequestError('An error occurred with our third party. Please try again at a later time.')
       } 
     const paystackBanks: IPaystackBank[] = response 
     return paystackBanks 
    } catch (error) {
      throw error
    }
  }
  private async accountNameInquiry(data: IAccountNameEnqury): Promise<IPaystackResolveAccount>{
    const {bankCode, accountNumber} = data
    const url = `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`
  try{
    const response: any = await this.api.get(url)
    const payStackResolveAccount : IPaystackResolveAccount = response
    return payStackResolveAccount
  } catch (e) {
    console.log(e)
    throw new BadRequestError('An error occurred with our third party. Please try again at a later time.')
  }
  }
  private async createRecipient(data: any): Promise<any>{
    const url = `/transferrecipient`
    try {
       const response: any = await this.api.post(url,{...data,account_number:data.accountNumber,bank_code:numToString(data.bankCode)})
      return response.recipient_code
    } catch (error) {

      throw error
    }
  }
  async pay(data: IPaymentInitializeRequest): Promise<IPaymentInitializeResponse> {
    const {userId,amount,accountNumber}= data
    try {
      const user = await this.db('users').where({ id: userId }).first();

    if (!user) {
      throw new NotFoundError('User not found');
    }
    const url =`/transaction/initialize`
    
      const chargeAmount = (amount || 0) * 100
    const payload: any = {
      amount: chargeAmount,
      email: user.email,
      account_number:Number(accountNumber),
      metadata: {
        full_name: user.name
      }
    }
      const response: any = await this.api.post(url, payload)
      const { authorization_url, reference, access_code } = response
      await this.db('transactions').insert({ reference,type:"deposit",user_id:user.id,amount:chargeAmount/100,gateway:"Paystack",status:'pending'});
      return {
        paymentProviderRedirectUrl: authorization_url,
        paymentReference: reference,
        accessCode: access_code 
      }
    } catch (e: any) {
      console.log("na here we dey ooo")
      throw e
    }
   
  }
  
  async withdraw(data: any): Promise<any> {
    const {userId,amount} = data
    const user = await this.db('users').where({ id: userId }).first();
    const url ='/transfer'
    
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.wallet < amount) {
      throw new BadRequestError('Insufficient funds');
    }
    try {
    const recipientCode = await this.createRecipient({...data,type:"nuban",accountNumber:Number(data.accountNumber)})
     let payload ={"source":'balance',amount,recipient:recipientCode,reference:`lendsqr-${Date.now()}`,reason:"Withdrawal"}
      const response: any = await this.api.post(url, payload)
      await this.db('transactions').insert({
        transfer_ref: response.transfer_code,
        reference: response.reference,
        type: 'withdraw',
        status: 'pending',
        amount: response.amount,
        user_id: userId,
        gateway:'Paystack'
      })
    return response 
   } catch (error) {
     console.log("Na d guy be this ooo")
    throw error
   }
  }

  async verifyWithdraw(reference: any,otp:number): Promise<any>{
    try {
      const isTransaction = await this.db('transactions').where({ reference }).first()
      const url = '/transfer/finalize_transfer'
      if (!isTransaction) {
        throw new NotFoundError('This transaction does not exist')
      }
      const response = await this.api.post(url, { transfer_code: isTransaction.transfer_ref, otp:otp})
      
      return response
    } catch (error) {
      throw error
    }
  }

 async transfer(data:IPaymentTransferRequest): Promise<IPaymentResponse | undefined> {
   const { senderId, receiverId, amount } = data
   try {
      const sender:any = await this.db('users').where({ id: senderId }).first();
      const receiver:any = await this.db('users').where({ id: receiverId }).first();
    if (sender.wallet < amount) {
      throw new ConflictError('Insufficient funds');
    }
     if (!sender || !receiver) {
      throw new NotFoundError(`${!sender? "Sender":"Receiver"} not found`);
     }
     let reference = 'lendsqr-transfer'+ Date.now()
     await this.db('transactions').insert({reference,type:"transfer-debit",amount,status:'completed',user_id:senderId,gateway:'Paystack'})
     await this.db('transactions').insert({reference,type:"transfer-credit",amount,status:'completed',user_id:receiverId,gateway:'Paystack'})
     await this.db('users').where({ id: senderId }).update({wallet : sender.wallet - amount})
     await this.db('users').where({ id: receiverId }).update({wallet : receiver.wallet + amount})
     return  {status:"success",message:"Transfer was successful"}
   } catch (error) {
     
    throw error
   }
 }
  
async verify(event: string,data:any): Promise<void>{
    const isTransaction: any = await this.db('transactions').where({ reference:data.reference }).first()
      const user : any = await this.db('users').where({id: isTransaction.user_id }).first()

    if (event === "charge.success") {
      await this.db('users').where({ id: isTransaction.user_id }).update({ wallet: (data.amount/100) + user.wallet });
      await this.db('transactions').where({ reference:data.reference }).update({status:"completed"})
    }
    if (event === "transfer.success") {
      await this.db('users').where({ id: isTransaction.user_id }).update({ wallet:user.wallet + (data.amount) });
      await this.db('transactions').where({ reference:data.reference }).update({status:"completed"})
    }
    if (event === "transfer.failed") {
      await this.db('transactions').where({ reference:data.reference }).update({status:"failed"})
    }
     if (event === "transfer.reversed") {
      await this.db('transactions').where({ reference:data.reference }).update({status:"reversed"})
   }
  }

}


"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("../exceptions");
const config_1 = require("../config");
const paystack_sdk_1 = require("paystack-sdk");
const transfer_1 = require("paystack-sdk/dist/transfer/transfer");
class PaymentService {
    constructor(db) {
        this.db = db;
        this.paystack = new paystack_sdk_1.Paystack(config_1.PAYSTACK_SECRET_KEY);
        this.transfer = new transfer_1.Transfer(config_1.PAYSTACK_SECRET_KEY);
    }
    async pay(userId, amount, reference) {
        const user = await this.db('usersTable').where({ id: userId }).first();
        if (!user) {
            throw new exceptions_1.NotFoundError('User not found');
        }
        const transaction = await this.paystack.transaction.initialize({
            amount: (amount * 100).toString(),
            email: user.email,
            reference,
        });
        return Object.assign(Object.assign({}, user), { wallet: user.wallet + amount, transactionId: transaction.data.reference });
    }
    async withdraw(userId, amount) {
        const user = await this.db('usersTable').where({ id: userId }).first();
        if (!user) {
            throw new exceptions_1.NotFoundError('User not found');
        }
        if (user.wallet < amount) {
            throw new exceptions_1.UnauthorizedError('Insufficient funds');
        }
        const transaction = await this.paystack.transfer.initiate({
            source: 'balance',
            amount: amount * 100,
            recipient: user.email,
            reference: `withdrawal-${Date.now()}`,
        });
        return Object.assign(Object.assign({}, user), { wallet: user.wallet - amount, transactionId: transaction.data.transfer_code });
    }
    async fund(userId, amount) {
        if (!Number.isInteger(userId) || userId < 1) {
            throw new exceptions_1.BadRequestError('Invalid user ID');
        }
        if (!Number.isInteger(amount) || amount < 1) {
            throw new exceptions_1.BadRequestError('Invalid amount');
        }
        const user = await this.db('usersTable').where({ id: userId }).first();
        if (!user) {
            throw new exceptions_1.NotFoundError('User not found');
        }
        const transaction = await this.paystack.transaction.initialize({
            amount: (amount * 100).toString(),
            email: user.email,
            reference: `lendsqr-pay-${Date.now()}`,
        });
        await this.db('usersTable').where({ id: userId })
            .update({ wallet: user.wallet + amount });
        delete (user.password);
        return Object.assign(Object.assign({}, user), { wallet: user.wallet, transactionId: transaction.data.reference });
    }
    async initTransfer(senderId, receiverId, amount) {
        const sender = await this.db('usersTable').where({ id: senderId }).first();
        if (!sender) {
            throw new exceptions_1.ConflictError('Sender not found');
        }
        const receiver = await this.db('usersTable').where({ id: receiverId }).first();
        if (!receiver) {
            throw new exceptions_1.ConflictError('Receiver not found');
        }
        if (sender.wallet < amount) {
            throw new exceptions_1.BadRequestError('Insufficient funds');
        }
        const transfer = await this.transfer.initiate({
            source: 'balance',
            reason: "We rise by lifting others",
            amount: amount * 100,
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
        return transfer;
    }
    async completeTransfer(transferCode, otp) {
        try {
            const transfer = await this.transfer.finalize(transferCode, otp);
            return transfer;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = PaymentService;

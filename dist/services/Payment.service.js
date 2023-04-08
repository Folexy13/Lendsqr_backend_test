"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("../exceptions");
const api_1 = require("../api");
const utils_1 = require("../utils");
class TransactionService {
    constructor(db) {
        this.db = db;
        this.api = new api_1.PaystackApi();
    }
    async getAll() {
        return await this.db('transactions').select('*');
    }
    async getBankList(query) {
        const baseURL = `/bank?country=${query}`;
        try {
            const response = await this.api.get(baseURL);
            if (!response && response.status !== 200) {
                throw new exceptions_1.BadRequestError('An error occurred with our third party. Please try again at a later time.');
            }
            const paystackBanks = response;
            return paystackBanks;
        }
        catch (error) {
            throw error;
        }
    }
    async accountNameInquiry(data) {
        const { bankCode, accountNumber } = data;
        const url = `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`;
        try {
            const response = await this.api.get(url);
            const payStackResolveAccount = response;
            return payStackResolveAccount;
        }
        catch (e) {
            console.log(e);
            throw new exceptions_1.BadRequestError('An error occurred with our third party. Please try again at a later time.');
        }
    }
    async createRecipient(data) {
        const url = `/transferrecipient`;
        try {
            const response = await this.api.post(url, Object.assign(Object.assign({}, data), { account_number: data.accountNumber, bank_code: (0, utils_1.numToString)(data.bankCode) }));
            return response.recipient_code;
        }
        catch (error) {
            throw error;
        }
    }
    async pay(data) {
        const { userId, amount, accountNumber } = data;
        try {
            const user = await this.db('users').where({ id: userId }).first();
            if (!user) {
                throw new exceptions_1.NotFoundError('User not found');
            }
            const url = `/transaction/initialize`;
            const chargeAmount = (amount || 0) * 100;
            const payload = {
                amount: chargeAmount,
                email: user.email,
                account_number: Number(accountNumber),
                metadata: {
                    full_name: user.name
                }
            };
            const response = await this.api.post(url, payload);
            const { authorization_url, reference, access_code } = response;
            await this.db('transactions').insert({ reference, type: "deposit", user_id: user.id, amount: chargeAmount / 100, gateway: "Paystack", status: 'pending' });
            return {
                paymentProviderRedirectUrl: authorization_url,
                paymentReference: reference,
                accessCode: access_code
            };
        }
        catch (e) {
            console.log("na here we dey ooo");
            throw e;
        }
    }
    async withdraw(data) {
        const { userId, amount } = data;
        const user = await this.db('users').where({ id: userId }).first();
        const url = '/transfer';
        if (!user) {
            throw new exceptions_1.NotFoundError('User not found');
        }
        if (user.wallet < amount) {
            throw new exceptions_1.BadRequestError('Insufficient funds');
        }
        try {
            const recipientCode = await this.createRecipient(Object.assign(Object.assign({}, data), { type: "nuban", accountNumber: Number(data.accountNumber) }));
            let payload = { "source": 'balance', amount, recipient: recipientCode, reference: `lendsqr-${Date.now()}`, reason: "Withdrawal" };
            const response = await this.api.post(url, payload);
            await this.db('transactions').insert({
                transfer_ref: response.transfer_code,
                reference: response.reference,
                type: 'withdraw',
                status: 'pending',
                amount: response.amount,
                user_id: userId,
                gateway: 'Paystack'
            });
            return response;
        }
        catch (error) {
            console.log("Na d guy be this ooo");
            throw error;
        }
    }
    async verifyWithdraw(reference, otp) {
        try {
            const isTransaction = await this.db('transactions').where({ reference }).first();
            const url = '/transfer/finalize_transfer';
            if (!isTransaction) {
                throw new exceptions_1.NotFoundError('This transaction does not exist');
            }
            const response = await this.api.post(url, { transfer_code: isTransaction.transfer_ref, otp: otp });
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    async transfer(data) {
        const { senderId, receiverId, amount } = data;
        try {
            const sender = await this.db('users').where({ id: senderId }).first();
            const receiver = await this.db('users').where({ id: receiverId }).first();
            if (sender.wallet < amount) {
                throw new exceptions_1.ConflictError('Insufficient funds');
            }
            if (!sender || !receiver) {
                throw new exceptions_1.NotFoundError(`${!sender ? "Sender" : "Receiver"} not found`);
            }
            let reference = 'lendsqr-transfer' + Date.now();
            await this.db('transactions').insert({ reference, type: "transfer-debit", amount, status: 'completed', user_id: senderId, gateway: 'Paystack' });
            await this.db('transactions').insert({ reference, type: "transfer-credit", amount, status: 'completed', user_id: receiverId, gateway: 'Paystack' });
            await this.db('users').where({ id: senderId }).update({ wallet: sender.wallet - amount });
            await this.db('users').where({ id: receiverId }).update({ wallet: receiver.wallet + amount });
            return { status: "success", message: "Transfer was successful" };
        }
        catch (error) {
            throw error;
        }
    }
    async verify(event, data) {
        const isTransaction = await this.db('transactions').where({ reference: data.reference }).first();
        const user = await this.db('users').where({ id: isTransaction.user_id }).first();
        if (event === "charge.success") {
            await this.db('users').where({ id: isTransaction.user_id }).update({ wallet: (data.amount / 100) + user.wallet });
            await this.db('transactions').where({ reference: data.reference }).update({ status: "completed" });
        }
        if (event === "transfer.success") {
            await this.db('users').where({ id: isTransaction.user_id }).update({ wallet: user.wallet + (data.amount) });
            await this.db('transactions').where({ reference: data.reference }).update({ status: "completed" });
        }
        if (event === "transfer.failed") {
            await this.db('transactions').where({ reference: data.reference }).update({ status: "failed" });
        }
        if (event === "transfer.reversed") {
            await this.db('transactions').where({ reference: data.reference }).update({ status: "reversed" });
        }
    }
}
exports.default = TransactionService;

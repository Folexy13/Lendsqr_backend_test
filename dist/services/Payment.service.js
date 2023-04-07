"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const exceptions_1 = require("../exceptions");
const config_1 = require("../config");
class TransactionService {
    constructor(db) {
        this.db = db;
        this.paystackBaseUrl = config_1.PAYSTACK_BASE_URL;
    }
    async getAll() {
        return await this.db('transactions').select('*');
    }
    async getBankList(country) {
        const baseUrl = this.paystackBaseUrl + `/bank/?country=${country}`;
        const headers = {
            Authorization: `Bearer ${config_1.PAYSTACK_SECRET_KEY}`,
            'content-type': 'application/json',
            'cache-control': 'no-cache'
        };
        try {
            const response = await axios_1.default.get(baseUrl, { headers });
            if (!response.data && response.status !== 200) {
                throw new Error('An error occurred with our third party. Please try again at a later time.');
            }
            const paystackBanks = response.data.data;
            return paystackBanks;
        }
        catch (error) {
            throw new exceptions_1.BadRequestError('An error occurred with our third party. Please try again at a later time.');
        }
    }
    async accountNameInquiry(data) {
        const { bankCode, accountNumber } = data;
        const baseURL = this.paystackBaseUrl + `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`;
        const headers = {
            Authorization: `Bearer ${config_1.PAYSTACK_SECRET_KEY}`,
            'content-type': 'application/json',
            'cache-control': 'no-cache'
        };
        try {
            const response = await axios_1.default.get(baseURL, { headers });
            if (!response.data && response.status !== 200) {
                throw new exceptions_1.BadRequestError('An error occurred with our third party. Please try again at a later time.');
            }
            const payStackResolveAccount = response.data.data;
            return payStackResolveAccount;
        }
        catch (e) {
            throw new exceptions_1.BadRequestError('An error occurred with our third party. Please try again at a later time.');
        }
    }
    async pay(data) {
        const { userId, amount } = data;
        try {
            const user = await this.db('users').where({ id: userId }).first();
            if (!user) {
                throw new exceptions_1.NotFoundError('User not found');
            }
            const base_url = this.paystackBaseUrl + `/transaction/initialize`;
            const headers = {
                Authorization: `Bearer ${config_1.PAYSTACK_SECRET_KEY}`,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
            };
            const chargeAmount = (amount || 0) * 100;
            const payload = {
                amount: chargeAmount,
                email: user.email,
                metadata: {
                    full_name: user.name
                }
            };
            const response = await axios_1.default.post(base_url, payload, {
                headers
            });
            if (!response.data && response.status !== 200) {
                throw new exceptions_1.BadRequestError('An error occurred with our third party. Please try again at a later time.');
            }
            const { authorization_url, reference, access_code } = response.data.data;
            await this.db('transactions').insert({ reference, type: "Wallet Funding", user_id: user.id, amount: chargeAmount / 100, gateway: "Paystack", status: 'pending' });
            return {
                paymentProviderRedirectUrl: authorization_url,
                paymentReference: reference,
                accessCode: access_code
            };
        }
        catch (e) {
            console.log(`e message`, e.message);
            console.log(e.stack);
            throw e;
        }
    }
    async verify(reference) {
        const isTransaction = await this.db('transactions').where({ reference }).first();
        try {
            if (!isTransaction) {
                throw new exceptions_1.NotFoundError('Transaction not found');
            }
            if (isTransaction.status === "completed") {
                throw new exceptions_1.ConflictError('Transaction already verified');
            }
            const user = await this.db('users').where({ id: isTransaction.user_id }).first();
            const baseURL = this.paystackBaseUrl + `/transaction/verify/${reference}`;
            const headers = {
                Authorization: `Bearer ${config_1.PAYSTACK_SECRET_KEY}`,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
            };
            const response = await axios_1.default.get(baseURL, { headers });
            if (!response.data && response.status !== 200) {
                throw new exceptions_1.BadRequestError('An error occurred with our third party. Please try again at a later time.');
            }
            const verificationResponse = response.data.data;
            await this.db('users').where({ id: user.id }).update({ wallet: user.wallet + isTransaction.amount });
            await this.db('transactions').where({ reference }).update({ status: "completed" });
            return verificationResponse;
        }
        catch (error) {
            throw error;
        }
    }
    // async withdraw(userId: number, amount: number): Promise<IUserType> {
    //   const user = await this.db('users').where({ id: userId }).first();
    //   if (!user) {
    //     throw new NotFoundError('User not found');
    //   }
    //   if (user.wallet < amount) {
    //     throw new UnauthorizedError('Insufficient funds');
    //   }
    //   const transaction:any = await this.paystack.transfer.initiate({
    //     source: 'balance', // Withdraw from the Paystack balance
    //     amount: amount * 100, // Paystack requires amount to be in kobo (i.e. smallest currency unit)
    //     recipient: user.email,
    //     reference: `withdrawal-${Date.now()}`,
    //   });
    //   return {
    //     ...user,
    //     wallet: user.wallet - amount,
    //     transactionId: transaction.data.transfer_code,
    //   };
    // }
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
            await this.db('transactions').insert({ reference, type: "Transfer", amount, status: 'completed', user_id: senderId, gateway: 'Paystack' });
            await this.db('transactions').insert({ reference, type: "Gift", amount, status: 'completed', user_id: receiverId, gateway: 'Paystack' });
            await this.db('users').where({ id: senderId }).update({ wallet: sender.wallet - amount });
            await this.db('users').where({ id: receiverId }).update({ wallet: receiver.wallet + amount });
            return { status: "success", message: "Transfer was successful" };
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = TransactionService;

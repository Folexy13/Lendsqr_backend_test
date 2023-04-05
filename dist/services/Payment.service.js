"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paystack_1 = __importDefault(require("paystack"));
class PaystackService {
    constructor(apiKey, webhookURL) {
        this.apiKey = apiKey;
        this.webhookURL = webhookURL;
        this.paystack = (0, paystack_1.default)(this.apiKey);
        //   this.webhook =  new Paystack.Webhook(this.apiKey);
        this.webhook.on('charge.success', this.handleTransactionUpdate.bind(this));
        this.webhook.setEndpoint(this.webhookURL);
    }
    async initializeTransaction(amount, email) {
        const response = await this.paystack.transaction.initialize({
            amount: amount * 100,
            email,
        });
        return response.data.authorization_url;
    }
    async verifyTransaction(reference) {
        // Wait for the transaction update to be received at the webhook endpoint
        // Instead of calling the Paystack API to verify the transaction
        return new Promise((resolve, reject) => {
            this.webhook.on('charge.success', (transaction) => {
                if (transaction.data.reference === reference && transaction.data.status === 'success') {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
            setTimeout(() => {
                reject(new Error('Webhook timeout'));
            }, 30000);
        });
    }
    async transferMoney(amount, recipient) {
        const response = await this.paystack.transfer.create({
            source: 'balance',
            amount: amount * 100,
            recipient,
        });
        return response.data;
    }
    handleTransactionUpdate(transaction) {
        console.log(`Transaction update received: ${transaction.data.reference}`);
    }
}
exports.default = PaystackService;

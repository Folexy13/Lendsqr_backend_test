"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const Payment_service_1 = __importDefault(require("../services/Payment.service"));
const utils_1 = require("../utils");
class PaymentController {
    constructor(db) {
        this.TransactionService = new Payment_service_1.default(db);
    }
    async getAllTransactions(req, res) {
        const users = await this.TransactionService.getAll();
        return res.status(201).send({ status: "success", message: "Transactions fetched Succesful", response: (0, utils_1.paginate)(users) });
    }
    async pay(req, res) {
        const { userId, amount } = req.body;
        try {
            const transaction = await this.TransactionService.pay({ userId, amount });
            res.status(200).send({ status: "success", message: "Transaction initialized successfully. Please wait while we verify your payment. You will receive a notification once the transaction is completed.", data: transaction });
        }
        catch (error) {
            res.status(error.statusCode || 500).send({ status: "failed", message: error.message });
        }
    }
    async verify(req, res) {
        const { reference } = req.params;
        try {
            const user = await this.TransactionService.verify(reference);
            res.status(200).send({ status: "success", messge: `Payment was ${user.gateway_response}` });
        }
        catch (error) {
            res.status(error.statusCode || 500).send({ status: "failed", message: error.message });
        }
    }
    async withdraw(req, res) {
        const { userId, amount } = req.body;
        try {
        }
        catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }
    async transfer(req, res) {
        try {
            const response = await this.TransactionService.transfer(req.body);
            return res.status(200).send(response);
        }
        catch (error) {
            return res.status(400).send({ status: "failed", message: error.message ? error.message : error });
        }
    }
}
exports.PaymentController = PaymentController;

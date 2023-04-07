"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const Payment_service_1 = __importDefault(require("../services/Payment.service"));
class PaymentController {
    constructor(db) {
        this.paymentService = new Payment_service_1.default(db);
    }
    async pay(req, res) {
        const { userId, amount, reference } = req.body;
        try {
            const user = await this.paymentService.pay(userId, amount, reference);
            res.json(user);
        }
        catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }
    async withdraw(req, res) {
        const { userId, amount } = req.body;
        try {
            const user = await this.paymentService.withdraw(userId, amount);
            res.json(user);
        }
        catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }
    async fund(req, res) {
        const { userId, amount } = req.body;
        try {
            const user = await this.paymentService.fund(userId, amount);
            return res.status(201).send({ status: "success", message: "Wallet top up successfuly", data: user });
        }
        catch (error) {
            return res.status(400).send({ status: "failed", message: error.message });
        }
    }
    async transfer(req, res) {
        const { senderId, receiverId, amount } = req.body;
        try {
            const transferDetails = await this.paymentService.initTransfer(senderId, receiverId, amount);
            if (transferDetails.status)
                return res.status(201).send({ status: "success", message: "Transfer successful", data: transferDetails });
            throw transferDetails.message;
        }
        catch (error) {
            console.log(error);
            return res.status(400).send({ status: "failed", message: error.message ? error.message : error });
        }
    }
}
exports.PaymentController = PaymentController;

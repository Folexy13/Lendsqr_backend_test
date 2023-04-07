"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferFundSchema = exports.fundWalletSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const requiredNumberSchema = joi_1.default.number().required();
exports.fundWalletSchema = joi_1.default.object({
    userId: requiredNumberSchema,
    amount: requiredNumberSchema,
});
exports.transferFundSchema = joi_1.default.object({
    senderId: requiredNumberSchema,
    receiverId: requiredNumberSchema,
    amount: requiredNumberSchema,
});

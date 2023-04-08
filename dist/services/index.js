"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = exports.UserService = void 0;
const User_service_1 = __importDefault(require("./User.service"));
exports.UserService = User_service_1.default;
const Payment_service_1 = __importDefault(require("./Payment.service"));
exports.TransactionService = Payment_service_1.default;

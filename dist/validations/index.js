"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyWithdraw = exports.withdrawFundSchema = exports.transferFundSchema = exports.fundWalletSchema = exports.loginReqBodySchema = exports.CreateUserSchema = void 0;
const userValidationSchema_1 = require("./userValidationSchema");
Object.defineProperty(exports, "CreateUserSchema", { enumerable: true, get: function () { return userValidationSchema_1.CreateUserSchema; } });
Object.defineProperty(exports, "loginReqBodySchema", { enumerable: true, get: function () { return userValidationSchema_1.loginReqBodySchema; } });
const transactionValidationSchema_1 = require("./transactionValidationSchema");
Object.defineProperty(exports, "fundWalletSchema", { enumerable: true, get: function () { return transactionValidationSchema_1.fundWalletSchema; } });
Object.defineProperty(exports, "transferFundSchema", { enumerable: true, get: function () { return transactionValidationSchema_1.transferFundSchema; } });
Object.defineProperty(exports, "withdrawFundSchema", { enumerable: true, get: function () { return transactionValidationSchema_1.withdrawFundSchema; } });
Object.defineProperty(exports, "verifyWithdraw", { enumerable: true, get: function () { return transactionValidationSchema_1.verifyWithdraw; } });

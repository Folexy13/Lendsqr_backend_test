"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginReqBodySchema = exports.CreateUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const requiredStringSchema = joi_1.default.string().required();
const requiredNumberSchema = joi_1.default.number().required();
exports.CreateUserSchema = joi_1.default.object({
    name: requiredStringSchema,
    password: requiredStringSchema,
    email: requiredStringSchema,
});
exports.loginReqBodySchema = joi_1.default.object({
    password: requiredStringSchema,
    email: requiredStringSchema,
});

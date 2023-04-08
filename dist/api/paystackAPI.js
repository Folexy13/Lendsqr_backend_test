"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaystackApi = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const colorette_1 = require("colorette");
const config_1 = require("../config");
dotenv_1.default.config();
class PaystackApi {
    constructor() {
        this.api = axios_1.default.create({
            baseURL: config_1.PAYSTACK_BASE_URL,
        });
        this.api.interceptors.request.use(async (request) => {
            request.headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${config_1.PAYSTACK_SECRET_KEY}`,
                'cache-control': 'no-cache'
            };
            return request;
        }, (error) => {
            console.log("App can't make a request");
            return Promise.reject(error);
        });
        this.api.interceptors.response.use((response) => {
            console.log((0, colorette_1.gray)("response received"));
            return response.data;
        }, (error) => {
            return Promise.reject(error);
        });
    }
    async post(url, data) {
        const response = await this.api.post(url, data);
        return response.data;
    }
    async get(url, params) {
        const response = await this.api.get(url, { params });
        return response.data;
    }
}
exports.PaystackApi = PaystackApi;

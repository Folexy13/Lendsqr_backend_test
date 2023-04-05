"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const startApp = async () => {
    const app = (0, express_1.default)();
    await (0, app_1.default)(app);
    const server = http_1.default.createServer(app);
    server
        .listen(3123, () => {
        console.log(`initiated Api Service`);
    })
        .on("listening", () => console.log(`Api Service listening on port 3123`))
        .on("error", (err) => {
        console.log(err);
        process.exit();
    })
        .on("close", () => {
        console.log(close);
    });
};
startApp();

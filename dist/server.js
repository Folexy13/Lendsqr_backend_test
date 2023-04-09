"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const config_1 = require("./config");
const app_1 = __importDefault(require("./app"));
const colorette_1 = require("colorette");
const startApp = async () => {
    const app = (0, express_1.default)();
    await (0, app_1.default)(app);
    const server = http_1.default.createServer(app);
    server
        .listen(config_1.PORT, () => {
        console.log(`initiated Api Service`);
    })
        .on("listening", () => console.log((0, colorette_1.bold)((0, colorette_1.greenBright)(`Api Service listening on port ${config_1.PORT}`))))
        .on("error", (err) => {
        console.log(err);
        process.exit();
    })
        .on("close", () => {
        console.log(close);
    });
};
startApp();

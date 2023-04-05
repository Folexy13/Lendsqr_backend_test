"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = require("./routes");
const exceptions_1 = require("./exceptions");
exports.default = async (app) => {
    if (process.env.ENV === "dev")
        app.use((0, morgan_1.default)("dev"));
    app.use((0, cors_1.default)());
    app.use((0, helmet_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use((0, cookie_parser_1.default)());
    app.use((0, compression_1.default)());
    app.use('/user', routes_1.UserRoute);
    app.get('/', (req, res) => {
        res.send("We dey gidigba");
    });
    // catch 404 and forward to error handler
    app.all("*", function (req, res) {
        return res.sendStatus(404);
    });
    app.use(exceptions_1.errHandler);
};

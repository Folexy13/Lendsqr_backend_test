"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.numToString = exports.paginate = void 0;
const pagination_1 = __importDefault(require("./pagination"));
exports.paginate = pagination_1.default;
const some_1 = require("./some");
Object.defineProperty(exports, "numToString", { enumerable: true, get: function () { return some_1.numToString; } });

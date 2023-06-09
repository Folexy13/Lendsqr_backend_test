"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const colorette_1 = require("colorette");
const Knex = __importStar(require("knex"));
const connectDb = Knex.knex({
    client: 'mysql2',
    connection: {
        host: config_1.DB_HOST,
        user: config_1.DB_USER,
        password: config_1.DB_PASS,
        database: config_1.DB_NAME,
        port: config_1.DB_PORT,
    },
});
const checkDatabaseConnection = async () => {
    try {
        await connectDb.raw('SELECT 1');
        console.log((0, colorette_1.yellow)('Database is up and running...'));
    }
    catch (error) {
        console.error(`Database is not running: ${error.message}`);
    }
};
checkDatabaseConnection();
exports.default = connectDb;

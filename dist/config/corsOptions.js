"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const whitelist = ["http://localhost:3000", "http://127.0.0.1:3000"];
const corsOptions = {
    origin(origin, callback) {
        whitelist.indexOf(origin) !== -1 || !origin
            ? callback(null, true)
            : callback(new Error("Not Allowed by cors"));
    },
    optionsSuccessStatus: 200,
};
exports.default = corsOptions;

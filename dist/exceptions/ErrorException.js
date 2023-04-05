"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errHandler = (err, req, res, next) => {
    // // console.log(err)
    // if (err.code === 11000) {
    //   err.statusCode = 409;
    //   const keyValue = err.keyValue;
    //   err.message = `A product already exists with details ${
    //     Object.keys(keyValue)[0]
    //   } ${Object.values(keyValue)[0]}`;
    // }
    // if (err.isAxiosError) {
    //   if (err.code === 'ECONNREFUSED') {
    //     err.statusCode = 503
    //     err.message = `${err.request._options.path.split('/')[1]} service unavailable.`
    //   }
    // }
    if (err.response) {
        err.statusCode = err.response.status;
        err.message = err.response.data.message;
    }
    return res
        .status(err.statusCode || 500)
        .json({ status: "failed", message: err.message });
};
exports.default = errHandler;

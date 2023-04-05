"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {ENV} from './config';
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Yoris Store API",
        version: "0.0.1",
    },
    // if (ENV === "prod") {
    //   Object.keys(swaggerDefinition.paths).map((key: string) => {
    //     const data = swaggerDefinition.paths[key];
    //     delete swaggerDefinition.paths[key];
    //     swaggerDefinition.paths["/v1/store" + key] = data;
    //   });
};
exports.default = swaggerDefinition;

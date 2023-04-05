import { SwaggerDefinition } from "swagger-jsdoc";
import {
  UserRoute,
} from "./routes";
// import {ENV} from './config';

const swaggerDefinition: SwaggerDefinition = {
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

export default swaggerDefinition;

import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } from "../config";

import * as Knex from "knex";
const connectDb = Knex.knex({
   client: 'mysql2',
 connection: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    port: DB_PORT,
  },
});

export default connectDb;

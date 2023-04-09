import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } from "../config";
const { Knex } = require("knex");

const knexConfig = {
  client: "mysql2",
  connection: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    port: DB_PORT,
  },
};

module.exports = knexConfig;

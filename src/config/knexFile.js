const { Knex } = require("knex");

const knexConfig = {
  client: "mysql2",
  connection: {
    host: "sql8.freemysqlhosting.net",
    user: "sql8610143",
    password: "TANhsXHL2k",
    database: "sql8610143",
    port: 3306,
  },
};

module.exports = knexConfig;

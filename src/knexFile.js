const { Knex } = require("knex");

const knexConfig = {
  client: "mysql2",
  connection: {
    host: "db4free.net",
    user: "folayemi",
    password: "Oluwabunmi13#",
    database: "folatestdb",
    port: 3306,
  },
};

module.exports = knexConfig;

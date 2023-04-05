import * as Knex from 'knex';
const knex = Knex.knex({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'your_database_user',
    password: 'your_database_password',
    database: 'your_database_name',
  },
});

export default knex
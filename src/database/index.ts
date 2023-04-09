import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } from "../config";
import {yellow,red} from 'colorette'

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


const checkDatabaseConnection = async () => {
  try {
    await connectDb.raw('SELECT 1');
    console.log(yellow('Database is up and running...'));
  } catch (error:any) {
    console.error(`Database is not running: ${error.message}` );
  }
};

checkDatabaseConnection()
export default connectDb;

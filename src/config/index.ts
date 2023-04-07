import "./envConfig";
const ENV: any = process.env.ENV;
const PORT = process.env.PORT;
const CRYPTOJS_KEY = process.env.CRYPTOJS_KEY;
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PORT = Number(process.env.DB_PORT);
const DB_NAME = process.env.DB_NAME;
const DB_PASS = process.env.DB_PASS;
const PAYSTACK_SECRET_KEY:any = process.env.PAYSTACK_SECRET_KEY
const PAYSTACK_BASE_URL:any = process.env.PAYSTACK_BASE_URL

export {
  DB_HOST,
  DB_USER,DB_PORT,
  CRYPTOJS_KEY,
  TOKEN_SECRET,
  PORT,
  DB_NAME,
  DB_PASS,
  PAYSTACK_SECRET_KEY,
  PAYSTACK_BASE_URL
};

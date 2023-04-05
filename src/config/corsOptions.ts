import { CorsOptions } from "cors";

const whitelist: string[] = ["http://localhost:3000", "http://127.0.0.1:3000"];

const corsOptions: CorsOptions = {
  origin(origin: any, callback) {
    whitelist.indexOf(origin) !== -1 || !origin
      ? callback(null, true)
      : callback(new Error("Not Allowed by cors"));
  },
  optionsSuccessStatus: 200,
};

export default corsOptions;

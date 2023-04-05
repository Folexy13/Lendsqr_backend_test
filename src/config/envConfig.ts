import { config } from "dotenv";
import path from "path";

((): void => {
  config({
    path: path.join(__dirname, "../..", ".env"),
  });
})();

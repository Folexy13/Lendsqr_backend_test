import express from "express";
import http from "http";
import { PORT} from "./config";
import createApp from "./app";
import { bold, greenBright } from "colorette";

const startApp = async () => {
  const app = express();

  await createApp(app);

  const server = http.createServer(app);

  server
    .listen(PORT, (): void => {
      console.log(`initiated Api Service`);
    })
    .on("listening", () =>
      console.log(bold(greenBright(`Api Service listening on port ${PORT}`)))
    )
    .on("error", (err: any) => {
      console.log(err);
      process.exit();
    })
    .on("close", () => {
      console.log(close)
    });
};


startApp();
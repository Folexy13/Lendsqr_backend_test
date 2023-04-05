import express from "express";
import http from "http";
import { PORT} from "./config";
import createApp from "./app";

const startApp = async () => {
  const app = express();

  await createApp(app);

  const server = http.createServer(app);

  server
    .listen(3123, (): void => {
      console.log(`initiated Api Service`);
    })
    .on("listening", () =>
      console.log(`Api Service listening on port 3123`)
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
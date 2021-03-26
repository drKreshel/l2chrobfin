import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

import { mongoDBClientConnection } from "./mongoDB";
import { robotResponse } from "./robotResponse";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer /*options*/);
const port = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, "../../public/")));

async function main() {
  await mongoDBClientConnection();

  io.on("connection", (socket: any) => {
    socket.on("chat", async (message: any) => {
      const response = await robotResponse(message);
      socket.emit("chat", response);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
}

main();

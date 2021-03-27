import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import { mongoDBClientConnection } from "./mongoDB";
import { robotResponse } from "./robotResponse";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  }
});
const port = process.env.PORT || 8000;

async function main() {
  await mongoDBClientConnection();

  io.on("connection", (socket: any) => {
    socket.on("chat", async (message: any) => {
      const response = await robotResponse(message);
      socket.emit("chat", response);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Back end server running on port: ${port}`);
  });
}

main();

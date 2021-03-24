import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

import {
  mongoDBClientConnection,
  mongoInsertOne,
  findLastOperations,
} from "./mongoDB";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer /*options*/);
const port = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "../../public/")));

async function main() {
  await mongoDBClientConnection();

  io.on("connection", (socket: any) => {
    // console.log('Some client connected')

    socket.on("chat", async (message: any) => {
      let response: string;
      if (message === "history") {
        //database read
        const arr = await findLastOperations();
        response = `*** beep boop... showing history of last ten operations *** \n`;
        for (let i = arr.length-1; i >= 0; i--) {
          response += `Input: ${arr[i].input} || Output: ${arr[i].output}  || Date: ${arr[i].date.toLocaleString()}\n`;
        }
      } else {
        // database write
        try {
          response = eval(message);
          await mongoInsertOne({
            input: message,
            output: response,
            date: new Date(),
          });
        } catch {
          response = "Please enter a valid mathematical expression";
        }
      }
      socket.emit("chat", response);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
}

main();

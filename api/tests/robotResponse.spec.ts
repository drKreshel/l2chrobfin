const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");

import { robotResponse, historyResponseFormatter } from "../src/robotResponse";
import { MongoClient } from "mongodb";
import { _insertOperation, _findLastOperations } from "../src/mongoDB";

const testClient = new MongoClient(
  "mongodb+srv://drKreshel:P4ssword@cluster0.puy8h.mongodb.net/chatbotCalculatorTestingRobot?retryWrites=true&w=majority",
  { useUnifiedTopology: true }
);


describe("robot", () => {
  let io: any, serverSocket: any, clientSocket: any;

  beforeAll(async (done) => {
    await testClient.connect();
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on("connection", (socket: any) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(async () => {
    io.close();
    clientSocket.close();
    await testClient.db("chatbotCalculatorTestingRobot").collection("operations").deleteMany({});
    await testClient.close();
  });

  async function insertOperation(data: object) {
    return _insertOperation("chatbotCalculatorTestingRobot", testClient, data);
  }

  async function findLastOperations() {
    return _findLastOperations("chatbotCalculatorTestingRobot", testClient);
  }

  beforeEach(async()=>{
    await testClient.db("chatbotCalculatorTestingRobot").collection("operations").deleteMany({});
  })

  it("should respond a result if user inputs a math operation in the chat box", (done) => {
    clientSocket.emit("chat", "2+2");

    serverSocket.on("chat", async (message: string) => {
      const response = await robotResponse( message, findLastOperations, insertOperation );
      serverSocket.emit("chat", response);
    });

    clientSocket.on("chat", (message: any) => {
      expect(message).toBe("4");
      done();
    });
  });

  it('should respond a 10 line entry of 10 previous operations if user inputs "history" in chat box', async (done) => {
    const mockOperations = [
      { input: "1+1", output: 2, date: new Date() },
      { input: "2+2", output: 4, date: new Date() },
      { input: "4+4", output: 8, date: new Date() },
      { input: "8+8", output: 16, date: new Date() },
      { input: "16+16", output: 32, date: new Date() },
      { input: "32+32", output: 64, date: new Date() },
      { input: "64+64", output: 128, date: new Date() },
      { input: "128+128", output: 256, date: new Date() },
      { input: "256+256", output: 512, date: new Date() },
      { input: "512+512", output: 1024, date: new Date() }
    ]
      await testClient.db("chatbotCalculatorTestingRobot").collection("operations").insertMany(mockOperations)

    clientSocket.emit("chatTwo", "history");
    serverSocket.on("chatTwo", async (message: string) => {
      const response = await robotResponse( message, findLastOperations, insertOperation );
      serverSocket.emit("chatTwo", response);
    });

    clientSocket.on("chatTwo", async (message: any) => {
      const cursor = testClient
        .db("chatbotCalculatorTestingRobot")
        .collection("operations")
        .find()
        .sort({ _id: -1 })
        .limit(10);
      const arr = await cursor.toArray();
      const result =  historyResponseFormatter(arr)
      expect(message).toBe(result);
      done();
    });
  });
});

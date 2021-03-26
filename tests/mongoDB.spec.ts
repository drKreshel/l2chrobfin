import {MongoClient} from 'mongodb';
import {_insertOperation, _findLastOperations} from "../src/mongoDB";

const testClient = new MongoClient(
  "mongodb+srv://drKreshel:P4ssword@cluster0.puy8h.mongodb.net/chatbotCalculatorTesting?retryWrites=true&w=majority",
  { useUnifiedTopology: true }
)

beforeAll(async () => {
  await testClient.connect()
  await testClient.db("chatbotCalculatorTesting").collection('operations').deleteMany({});
});

afterAll(async () => {
  await testClient.close();
});

afterEach(async()=>{
  await testClient.db("chatbotCalculatorTesting").collection('operations').deleteMany({});
})


describe('insertOperation', () => {
 
  it("should insert an operation into operation's collection", async () => {
    const mockOperation = { input: "2 + 2", output: 4, date: new Date() }
    await _insertOperation("chatbotCalculatorTesting", testClient, mockOperation)
    const operationsCursor = testClient.db("chatbotCalculatorTesting").collection('operations').find();
    const operations = await operationsCursor.toArray();
    const insertedOperation = operations[operations.length-1]
    expect(Object.keys(insertedOperation)).toEqual(['_id', 'input', 'output', 'date']);
    expect(insertedOperation.input).toBe('2 + 2');
    expect(insertedOperation.output).toBe(4);
  });

  it.each`
  mockOperation
    ${{ input: "-4 * 4", output: -28, date: new Date() }}
    ${{ input: "-4 + 4", output: 0, date: new Date() }}
    ${{ input: "-4432/22", output: -201.45454545454547, date: new Date() }}
    ${{ input: "-4 * 4", output: -28, date: new Date() }}
  `(
    "should insert $mockOperation into operation's collection",
    async ({ mockOperation}) => {
      await _insertOperation("chatbotCalculatorTesting", testClient, mockOperation);
      const operationsCursor = testClient.db("chatbotCalculatorTesting").collection('operations').find();
      const operations = await operationsCursor.toArray();
      const insertedOperation = operations[operations.length-1]
      expect(insertedOperation.input).toBe(mockOperation.input);
      expect(insertedOperation.output).toBe(mockOperation.output);
    }
  );
});

describe('findLastOperations', ()=>{
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

  it("should return the latest 10 operations", async () => {
    await testClient.db("chatbotCalculatorTesting").collection("operations").insertMany(mockOperations)
    const response = await _findLastOperations("chatbotCalculatorTesting", testClient)
    expect(response[0].output).toBe(1024);
    expect(response[1].output).toBe(512);
    expect(response[2].output).toBe(256);
    expect(response[9].output).toBe(2);
  });

  it("should return 1 operation if there is only one operation in the collection", async () => {
    await testClient.db("chatbotCalculatorTesting").collection("operations").insertOne({ input: "512+512", output: 1024, date: new Date() });
    const response = await _findLastOperations("chatbotCalculatorTesting", testClient)
    expect(response.length).toBe(1);
  });
})

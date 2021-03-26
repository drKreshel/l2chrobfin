import { MongoClient } from "mongodb";

const devClient = new MongoClient(
  "mongodb+srv://drKreshel:P4ssword@cluster0.puy8h.mongodb.net/chatbotCalculator?retryWrites=true&w=majority",
  { useUnifiedTopology: true }
);

export async function mongoDBClientConnection() {
  await devClient.connect();
}

export async function insertOperation(data: object) {
  _insertOperation("chatbotCalculator", devClient, data);
}

export async function _insertOperation(
  db: string,
  client: MongoClient,
  data: object,
) {
  if (!data) {
    throw new Error("must pass a data object");
  }
  try {
    await client.db(db).collection("operations").insertOne(data);
  } catch (error) {
    console.error(error);
  }
}

export async function findLastOperations() {
  return _findLastOperations("chatbotCalculator", devClient);
}
export async function _findLastOperations(db: string, client: MongoClient) {
  const cursor = client
    .db(db)
    .collection("operations")
    .find()
    .sort({ _id: -1 })
    .limit(10);
  const result = await cursor.toArray();
  return result;
}

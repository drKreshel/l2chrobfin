import { MongoClient } from "mongodb";

const client = new MongoClient(
  "mongodb+srv://drKreshel:P4ssword@cluster0.puy8h.mongodb.net/chatbotCalculator?retryWrites=true&w=majority"
);

export async function mongoDBClientConnection() {
  await client.connect();
}

export async function mongoInsertOne(data?: object) {
  console.log(client)
  if (!data) {
    throw new Error("must pass a data object");
  }
  try {
    const result = await client
      .db("chatbotCalculator")
      .collection("operations")
      .insertOne(data);
    console.log(
      `New operation created in db with the following id: ${result.insertedId}`
    );
  } catch (error) {
    console.error(error);
  }
}

export async function findLastOperations() {
  console.log(client)
  const cursor = client
    .db("chatbotCalculator")
    .collection("operations")
    .find()
    .sort({date:-1})
    .limit(10);
    const result = await cursor.toArray();
    return result;
}



/* Open connection on each db request */
// async function mongoConnect(
//   fn: (client: MongoClient, data?: object) => Promise<void>,
//   data?: object
// ) {

//  try {
//     await client.connect();
//     await fn(client, data);
//   } catch (e) {
//     console.error(e);
//   } finally {
//     await client.close();
//   }
// }

// async function mongoCreate(client: MongoClient, data?: object) {
//   if (!data) {
//     throw new Error("must pass a data object");
//   }
//   try {
//     const result = await client
//       .db("chatbotCalculator")
//       .collection("operations")
//       .insertOne(data);
//     console.log( `New operation created in db with the following id: ${result.insertedId}` );
//   } catch (error) {
//     console.error(error);
//   }
// }
// mongoOperation(mongoCreate({"name":"Carlos"})).catch(console.error);

// export function mongoInsertOne(data: object) {
//   return mongoConnect(mongoCreate, data);
// }

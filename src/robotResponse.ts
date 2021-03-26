import evaluate from "evaluator.js";

import { insertOperation, findLastOperations } from "./mongoDB";

interface FindResult {
  _id: number;
  input: string;
  output: string;
  date: Date;
}

interface InsertInput {
  input: string;
  output: string;
  date: Date;
}

export async function robotResponse(
  message: string,
  find: (data?: object) => Promise<FindResult[]> = findLastOperations,
  insert: (input: InsertInput) => Promise<void> = insertOperation
) {
  let response: string;
  if (message === "history") {
    const arr = await find();
    response = historyResponseFormatter(arr)
  } else {
    try {
      response = evaluate(message).toString();
      await insert({
        input: message,
        output: response,
        date: new Date(),
      });
    } catch (error) {
      response = error.message;
    }
  }
  return response;
}

export function historyResponseFormatter(arr:FindResult[]){
  let response = `*** beep boop... showing history of last ten operations *** \n`;
  for (let i = arr.length - 1; i >= 0; i--) {
    response += `Input: ${arr[i].input} || Output: ${
      arr[i].output
    }  || Date: ${arr[i].date.toLocaleString()}\n`;
  }
  return response;
}

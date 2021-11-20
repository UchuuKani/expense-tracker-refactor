import { NextApiRequest, NextApiResponse } from "next";
import {
  tempTransactionStore,
  getKeyInEntity,
  addToEntity,
} from "./utils/tempEntities";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const transactionId = req?.query?.id;
  const postBody = req?.body;

  if (req.method === "GET") {
    if (typeof transactionId === "string") {
      const foundTransaction = getKeyInEntity(
        tempTransactionStore,
        transactionId
      );

      if (foundTransaction) return res.status(200).json(foundTransaction);
      return res.send(404);
    }
  } else if (req.method === "POST") {
    // check to make sure we have a body, if not error out or something
    const parsedBody = JSON.parse(postBody);
    const attemptToAddTransaction = addToEntity("TRANSACTION", parsedBody);

    return res.send(attemptToAddTransaction);
  }

  return res.status(500).send("Internal server error");
};

import { NextApiRequest, NextApiResponse } from "next";
import { tempTransactionStore, getKeyInEntity } from "../utils/tempEntities";

export default (req: NextApiRequest, res: NextApiResponse) => {
  let { id: transactionId } = req?.query;

  if (req.method === "GET") {
    if (typeof transactionId === "string") {
      const foundTransaction = getKeyInEntity(
        tempTransactionStore,
        transactionId
      );

      if (foundTransaction) return res.status(200).json(foundTransaction);
    }

    return res.status(404).send("Page not found");
  } else if (req.method === "POST") {
    if (typeof transactionId === "string") {
      return res.status(200).json(tempTransactionStore[transactionId]);
    }
  }

  return res.status(500).send("Internal server error");
};

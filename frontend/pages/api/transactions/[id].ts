import { IncomingMessage, ServerResponse } from "http";
import { tempTransactionStore, getKeyInEntity } from "../utils/tempEntities";

export default (req: IncomingMessage, res: ServerResponse) => {
  const { id: transactionId } = req?.query;
  switch (true) {
    case req.method === "GET": {
      const foundTransaction = getKeyInEntity(
        tempTransactionStore,
        transactionId
      );

      if (foundTransaction) return res.status(200).json(foundTransaction);
      else return res.sendStatus(404);
    }
    case req.method === "POST":
      return res.status(200).json(tempTransactionStore[transactionId]);
    default:
      return res.sendStatus(500);
  }
};

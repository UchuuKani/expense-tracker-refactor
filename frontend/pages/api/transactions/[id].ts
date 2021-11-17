import { IncomingMessage, ServerResponse } from "http";
import { tempTransactionStore } from "../tempEntities";

export default (req: IncomingMessage, res: ServerResponse) => {
  const { id: transactionId } = req?.query;
  switch (true) {
    case req.method === "GET":
      return res.status(200).json(tempTransactionStore[transactionId]);
    case req.method === "POST":
      return res.status(200).json(tempTransactionStore[transactionId]);
    default:
      return res.sendStatus(500);
  }
};

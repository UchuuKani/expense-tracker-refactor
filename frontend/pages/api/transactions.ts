import { IncomingMessage, ServerResponse } from "http";
import {
  tempTransactionStore,
  getKeyInEntity,
  addToEntity,
} from "./utils/tempEntities";

export default (req: IncomingMessage, res: ServerResponse) => {
  const { id: transactionId } = req?.query || {};
  const postBody = req?.body;
  console.log("yetr?", typeof postBody, postBody);
  switch (true) {
    case req.method === "GET": {
      const foundTransaction = getKeyInEntity(
        tempTransactionStore,
        transactionId
      );

      if (foundTransaction) return res.status(200).json(foundTransaction);
      else return res.send(404);
    }
    case req.method === "POST": {
      // check to make sure we have a body, if not error out or something
      const parsedBody = JSON.parse(postBody);
      const attemptToAddTransaction = addToEntity("TRANSACTION", parsedBody);
      console.log("attempt plz", attemptToAddTransaction);
      return res.send(attemptToAddTransaction);
    }

    default:
      return res.sendStatus(500);
  }
};

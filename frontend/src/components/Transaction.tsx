import React from "react";

import { ITag } from "./Tag";
import styles from "./Transaction.module.scss";

interface Props {
  transaction: ITransaction;
  removeTransaction: (transactionId: number) => void;
}

export interface ITransaction {
  description: string;
  amount: number;
  transaction_date: string;
  id: number;
  user_id: number;
  tags?: ITag[];
}

const Transaction = ({ transaction, removeTransaction }: Props) => {
  let { description, amount, transaction_date } = transaction;

  let truncDescription;

  if (description.length > 30) {
    truncDescription = description.slice(0, 30) + "...";
  } else truncDescription = "";
  console.log("this is the transaction date", transaction_date);
  return (
    <tr className={styles["transaction-row"]}>
      <td onClick={() => removeTransaction(transaction.id)}>X</td>
      <td>{truncDescription ? truncDescription : description}</td>
      <td>${(amount / 100).toFixed(2)}</td>
      <td>{transaction_date}</td>
    </tr>
  );
};

export default Transaction;

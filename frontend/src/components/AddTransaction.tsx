import React, { useState, FormEvent, ChangeEvent } from "react";
// import axios from "axios";

import { ITransaction } from "./Transaction";
// import styles from "./AddTransaction.module.scss";

// use FormEvent to type the submit event in the form
// use ChangeEvent to type the onChange events

interface Props {
  userId: string;
  addNewTransaction: (actionFn: any, transaction: ITransaction) => void;
}

interface ServerResponse {
  data: ITransaction;
}

function addTransactionCreator(transaction: ITransaction): {
  type: string;
  payload: ITransaction;
} {
  return { type: "ADD_TRANSACTION", payload: transaction };
}

const AddTransaction: React.FunctionComponent<Props> = ({
  userId,
  addNewTransaction,
}) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState("");

  // type the event, probably also want to render something if there is an error - not sure how to use useAxios here though
  // as hooks need to be called in the top level scope of a functional component but I want to only useAxios on submit - would
  // be violating no conditional hooks?
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      //   const { data } = await axios.post<ITransaction>(`/api/users/${userId}`, {
      //     description,
      //     amount,
      //     tags,
      //     date,
      //   });
      const res = await fetch(`/api/users/${userId}`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({
          description,
          amount,
          tags,
          date,
        }), // body data type must match "Content-Type" header
      });
      // should add logic to check res.ok before attempting to call .json() method
      const data = await res.json();
      console.log("why is the date fucked", date);
      setDescription("");
      setAmount("");
      setTags("");
      setDate("");
      addNewTransaction(addTransactionCreator, data);
    } catch (e) {
      console.error(e);
    }
  };
  console.log("the date", date);
  return (
    <form
      onSubmit={handleSubmit}
      // className={styles["add-transaction"]}
    >
      <ul className="flex-outer">
        <li>
          <label className="transaction-label" htmlFor="transactionDescription">
            Description
          </label>
          <input
            type="text"
            name="transactionDescription"
            value={description}
            onChange={(event: ChangeEvent<HTMLInputElement>): void =>
              setDescription(event.target.value)
            }
            placeholder="Enter description"
          ></input>
        </li>
        <li>
          <label className="transaction-label" htmlFor="transactionAmount">
            Amount
          </label>
          <input
            className="transaction-input"
            type="text"
            name="transactionAmount"
            value={amount}
            inputMode="decimal"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setAmount(event.target.value)
            }
            placeholder="Enter amount"
          ></input>
        </li>
        <li>
          <label className="transaction-label" htmlFor="tags">
            Tags
          </label>
          <input
            className="transaction-input"
            id="tags-input"
            type="text"
            name="tags"
            value={tags}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setTags(event.target.value)
            }
            placeholder="Enter tags as a comma separated list"
          ></input>
        </li>
        <li>
          <label className="transaction-label" htmlFor="transaction-date">
            Date
          </label>
          <input
            className="transaction-input"
            id="date-input"
            type="date"
            name="date-input"
            value={date}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setDate(event.target.value)
            }
            placeholder="Select a date from the date picker"
          ></input>
        </li>
        <li>
          <button className="submit" type="submit">
            Submit
          </button>
        </li>
      </ul>
    </form>
  );
};

export default AddTransaction;

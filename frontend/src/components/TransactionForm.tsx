import React, { useReducer } from "react";
import { useMachine } from "@xstate/react";

// utils
import { isEmptyString } from "../global-utils";

// components
import Button from "./Button";

interface FormState {
  date: Date | string | undefined;
  // while the amount is technically a number, it is represented as a string by the form
  // by using input[type="number"], it seems to guarantee we can only enter numeric values and "."
  amount: string;
  description: string;
  tags?: string[] | undefined;
}

type EventTypes = "CHANGE" | "SUBMIT";
type FieldTypes = "amount" | "description" | "tags" | "date";

interface ReducerEvent {
  type: EventTypes;
  payload?: {
    field: FieldTypes;
    value: string | number | Date | string[];
  };
}

const initialFormState: FormState = {
  amount: "",
  description: "",
  tags: [],
  date: new Date("2021-05-25"),
};

// type guard function, implementation from StackOverflow: https://stackoverflow.com/a/57065841
function isFieldType(fieldType: string): fieldType is FieldTypes {
  return ["amount", "description", "tags", "date"].includes(fieldType);
}

function reducer(state: FormState, event: ReducerEvent): FormState {
  switch (event.type) {
    case "CHANGE": {
      if (!event.payload) return state;

      return { ...state, [event.payload.field]: event.payload.value };
    }
    case "SUBMIT": {
      return initialFormState;
    }
    default:
      return state;
  }
}

const TransactionForm: React.FC = (props) => {
  const [state, send] = useReducer(reducer, initialFormState);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // below is usage of a type guard I believe
    if (isFieldType(event.target.name)) {
      send({
        type: "CHANGE",
        payload: { field: event.target.name, value: event.target.value },
      });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // make some api call to persist entities
    // fetch(...).then(...)

    // if it succeeds, clear the form to be able to enter more transactions, but probably within the promise chain itself, or make handleSubmit an async function
    // need to think of intermediate states, such as "loading", "error", "validating"?, etc and add validations
    // what would even need to be validated?
    // non-empty inputs before being able to submit (disable submit button, or have it do nothing until all inputs filled) - excluding "tags" field
    // if manually entering a date, need to validate it is in a valid format/a real date. In general, dates should not be in the future
    // --I don't believe a user should be able to enter a date in the future since the idea behind this project is to enter transactions from receipts
    send({ type: "SUBMIT" });
  };

  return (
    <form className="transaction-form-container" onSubmit={handleSubmit}>
      <div className="transaction-field-container">
        <label htmlFor="description">Description:</label>
        <input
          id="description"
          name="description"
          value={state.description}
          onChange={handleChange}
          disabled={false}
        />
      </div>
      <div className="transaction-field-container">
        <label htmlFor="amount">Amount:</label>
        <input
          id="amount"
          name="amount"
          type="number"
          value={state.amount}
          onChange={handleChange}
          disabled={false}
        />
      </div>
      <div className="transaction-field-container">
        <label htmlFor="tags">Tags:</label>
        <input
          id="tags"
          name="tags"
          value={state.tags}
          onChange={handleChange}
          disabled={false}
        />
      </div>
      <div className="transaction-field-container">
        <label htmlFor="date">Date:</label>
        {/* 
          seems like using type="date" is inserting some default styles from 
          Chrome which messes up alignment with rest of input fields. Selector in
          question?: input[type="date" i]
        */}
        {/* 
          may want to use Moment for validating date-related inputs and processing
          https://momentjs.com/docs/#/-project-status/
          though according to docs there may be better alternatives now
          as of 11/29/2021
        */}
        <input
          id="date"
          name="date"
          type="date"
          value={state.date}
          onChange={handleChange}
          disabled={false}
        />
      </div>
      <Button classes="transaction-submit-button" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default TransactionForm;

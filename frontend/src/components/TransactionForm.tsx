import React, { useReducer } from "react";
import Button from "./Button";
import { useMachine } from "@xstate/react";

interface FormState {
  date: Date;
  amount: number | undefined;
  description: string;
  tags?: string[];
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
  amount: undefined,
  description: "",
  tags: [],
  date: new Date("2021-05-25"),
};

// type guard function, implementation from SO: https://stackoverflow.com/a/57065841
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
      return state;
    }
    default:
      return state;
  }
}

const TransactionForm: React.FC = (props) => {
  const [state, send] = useReducer(reducer, initialFormState);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // usage of a type guard I believe
    if (isFieldType(event.target.name)) {
      send({
        type: "CHANGE",
        payload: { field: event.target.name, value: event.target.value },
      });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    console.log("form submitted");
  };

  return (
    <form className="transaction-container" onSubmit={handleSubmit}>
      <div>
        {" "}
        <label htmlFor="description">Description</label>
        <input
          id="description"
          name="description"
          value={state.description}
          onChange={handleChange}
          disabled={false}
        />
      </div>
      <div>
        {" "}
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          name="amount"
          type="number"
          value={state.amount}
          onChange={handleChange}
          disabled={false}
        />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default TransactionForm;

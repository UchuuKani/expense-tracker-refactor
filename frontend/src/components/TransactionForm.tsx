import React, { useReducer } from "react";
import { useMachine } from "@xstate/react";

interface FormState {
  date: Date;
  amount: number;
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
  amount: 0,
  description: "",
  tags: [],
  date: new Date("2021-05-25"),
};

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
    send({
      type: "CHANGE",
      payload: { field: event.target.name, value: event.target.value },
    });
  };

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 10,
        textAlign: "center",
      }}
    >
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
          value={state.amount}
          onChange={handleChange}
          disabled={false}
          placeholder=""
        />
      </div>
    </form>
  );
};

export default TransactionForm;

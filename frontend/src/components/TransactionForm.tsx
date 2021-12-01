import React, { useReducer } from "react";
import { useMachine } from "@xstate/react";

// utils
import { isEmptyString } from "../global-utils";

// components
import Button from "./Button";

interface FormInputState {
  date: string;
  // while the amount is technically a number, it is represented as a string by the form
  // by using input[type="number"], it seems to guarantee we can only enter numeric values and "."
  amount: string;
  description: string;
  tags?: string[];
}

interface FormErrorState {
  description?: string;
  amount?: string;
  tags?: string;
  date?: string;
}

interface CombinedFormState {
  inputs: FormInputState;
  errors: FormErrorState;
  loading: boolean;
}

type EventTypes = "CHANGE" | "SET_ERRORS" | "SUBMIT";
type FieldTypes = "amount" | "description" | "tags" | "date";

interface ReducerEvent {
  type: EventTypes;
  payload?: {
    field?: FieldTypes;
    value?: string | number | string[];
    errors?: FormErrorState;
  };
}

// reducer definitions
const initialFormState: CombinedFormState = {
  inputs: {
    amount: "",
    description: "",
    tags: [],
    date: "",
  },
  errors: {
    amount: "",
    description: "",
    tags: "",
    date: "",
  },
  loading: false,
};

function reducer(
  state: CombinedFormState,
  event: ReducerEvent
): CombinedFormState {
  switch (event.type) {
    case "CHANGE": {
      if (!event.payload) return state;

      if (event.payload.field) {
        return {
          ...state,
          inputs: {
            ...state.inputs,
            [event.payload.field]: event.payload.value,
          },
        };
      }
    }
    case "SET_ERRORS": {
      return { ...state, errors: { ...state.errors } };
    }
    case "SUBMIT": {
      return initialFormState;
    }
    default:
      return state;
  }
}

// type guard function, implementation from StackOverflow: https://stackoverflow.com/a/57065841
function isFieldType(fieldType: string): fieldType is FieldTypes {
  return ["amount", "description", "tags", "date"].includes(fieldType);
}

// input field list
interface InputFieldItem {
  identifier: FieldTypes;
  label: string;
  inputType?: React.HTMLInputTypeAttribute | undefined;
}

const inputFieldItems: InputFieldItem[] = [
  { identifier: "description", label: "Description" },
  { identifier: "amount", label: "Amount", inputType: "number" },
  { identifier: "tags", label: "Tags" },
  { identifier: "date", label: "Date", inputType: "date" },
];

// field validators
interface ValidationError {
  error: boolean;
  message?: string;
}

function descriptionValidator(desc: string): ValidationError {
  if (isEmptyString(desc))
    return { error: true, message: "Description can't be blank" };
  // arbitrary validation, but want to make sure description is 5 characters or longer in length
  if (desc.length < 5)
    return {
      error: true,
      message: "Description must be longer than 5 characters",
    };
  return { error: false };
}

// want to handle positive and negative values - either should be ok
function amountValidator(amount: number | string): ValidationError {
  // potentially redundant to check isNaN after verifying typeof === number?
  if (typeof amount === "number" && isNaN(amount))
    return { error: true, message: "Amount can only be a number" };
  if (typeof amount === "string" && isNaN(parseFloat(amount)))
    return { error: true, message: "Amount can only be a number" };

  // would it make sense to enter a 0 dollar amount? for sake of this exercise, lets say no
  if (amount === 0 || amount === "0")
    return { error: true, message: "Amount can't be 0" };

  return { error: false };
}

function tagsValidator(tags: string[]): ValidationError {
  // tags are optional
  if (tags.length === 0) return { error: false };

  // if tags are included, they should not be an empty string
  for (const tag of tags) {
    if (isEmptyString(tag))
      // might need to re-examine this
      return { error: true, message: "Tags cannot be empty" };
  }

  return { error: false };
}

// by using input type=date, the html element already prevents invalid dates from being entered
// via keyboard (e.g. if trying to enter a month as 13, it autocorrects to 12)
function dateValidator(inputDate: string): ValidationError {
  if (isEmptyString(inputDate))
    return { error: true, message: "Date is required" };

  // date can't be in the future
  if (Date.parse(inputDate) > new Date().valueOf())
    return { error: true, message: "Date can't be in the future" };

  return { error: false };
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
    // validate front end inputs before api call
    let validDescription = descriptionValidator(state.inputs.description);
    let validAmount = amountValidator(state.inputs.amount);
    let validTags;
    // tags is not a required field
    if (state.inputs.tags !== undefined) {
      validTags = tagsValidator(state.inputs.tags);
    }

    let validDate = dateValidator(state.inputs.date);
    console.log(
      "desc",
      validDescription,
      "| amount",
      validAmount,
      "| tags",
      validTags,
      "| date",
      validDate
    );
    // probably want to set some errors too
    if (
      !validDescription.error ||
      !validAmount.error ||
      (validTags && !validTags.error) ||
      !validDate.error
    ) {
      let errors: FormErrorState = {};

      if (validDescription.error && validDescription.message) {
        errors.description = validDescription.message;
      }
      if (validAmount.error && validAmount.message) {
        errors.amount = validAmount.message;
      }
      if (validTags && validTags.error && validTags.message) {
        errors.tags = validTags.message;
      }
      if (validDate.error && validDate.message) {
        errors.date = validDate.message;
      }
      console.log("hez errors", errors);
      send({ type: "SET_ERRORS", payload: { errors } });
      return;
    }

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
          value={state.inputs.description}
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
          value={state.inputs.amount}
          onChange={handleChange}
          disabled={false}
        />
      </div>
      <div className="transaction-field-container">
        <label htmlFor="tags">Tags:</label>
        <input
          id="tags"
          name="tags"
          value={state.inputs.tags}
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
          value={state.inputs.date}
          onChange={handleChange}
          disabled={false}
        />
        {inputFieldItems.map((item) => {
          return (
            <TransactionField
              key={item.identifier}
              id={item.identifier}
              name={item.identifier}
              type={item.inputType}
              value={state.inputs[item.identifier]}
              handleChange={handleChange}
              disabled={false}
              labelContent={item.label}
            />
          );
        })}
      </div>
      <Button classes="transaction-submit-button" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default TransactionForm;

interface ITransactionFieldProps {
  id: FieldTypes;
  name: FieldTypes;
  type?: React.HTMLInputTypeAttribute | undefined;
  value: any;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  labelContent: string;
}

const TransactionField: React.FC<ITransactionFieldProps> = ({
  id,
  name,
  type = "text",
  value,
  handleChange,
  disabled,
  labelContent,
}) => {
  // could map over array of strings which represent the inputs (e.g. ["description", "amount", "tags", "date"]), or array of objects with the string as one field
  // id and name would come from the string itself
  // type would be passed in conditionally based on type of input? e.g. for amount, type=number, date is type=date
  // value would be passed in based on state[currentStringInArray]
  // labelContent could be passed in based on
  return (
    <div className="transaction-field-container">
      <label htmlFor={name}>{labelContent}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
};

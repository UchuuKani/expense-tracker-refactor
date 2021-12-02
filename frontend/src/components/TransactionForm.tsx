import React, { useReducer } from "react";
import { useMachine } from "@xstate/react";

// utils
import {
  isEmptyString,
  normalizeString,
  containsDuplicates,
} from "../global-utils";

// components
import Button from "./Button";

interface FormInputState {
  date: string;
  // while the amount is technically a number, it is represented as a string by the form
  // by using input[type="number"], it seems to guarantee we can only enter numeric values and "."
  amount: string;
  description: string;
  tagInput?: string;
}

interface FormErrorState {
  description?: string;
  amount?: string;
  tagInput: string;
  date?: string;
}

interface CombinedFormState {
  inputs: FormInputState;
  errors: FormErrorState;
  loading: boolean;
  tagsList: string[];
}

type EventTypes = "CHANGE" | "SET_ERRORS" | "ADD_TAG" | "REMOVE_TAG" | "SUBMIT";
type FieldTypes = "amount" | "description" | "tagInput" | "date";

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
    tagInput: "",
    date: "",
  },
  errors: {
    amount: "",
    description: "",
    tagInput: "",
    date: "",
  },
  loading: false,
  tagsList: [],
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
      return {
        ...state,
        errors: { ...state.errors, ...event.payload?.errors },
      };
    }
    case "ADD_TAG": {
      if (state.inputs.tagInput) {
        return {
          ...state,
          tagsList: [...state.tagsList, state.inputs.tagInput],
          inputs: { ...state.inputs, tagInput: "" },
        };
      }
      return state;
    }
    case "REMOVE_TAG": {
      if (event && event.payload && event.payload.value) {
        const newList = state.tagsList.filter((tag) => {
          return tag !== event.payload.value;
        });

        return { ...state, tagsList: newList };
      }
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
  return ["amount", "description", "tagsList", "tagInput", "date"].includes(
    fieldType
  );
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
  { identifier: "tagInput", label: "Tags" },
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

const fieldValidators = {
  description: descriptionValidator,
  amount: amountValidator,
  tags: tagsValidator,
  date: dateValidator,
};

// this is meant to be the blur handler on fields to determine if a field error should be cleared (assuming an error exists for the field)
// or should we just let the user re-submit, instead of trying to clear errors on blur?
function validateField(
  identifier: keyof typeof fieldValidators,
  fieldVal: string,
  send: (reducerEvent: ReducerEvent) => void
): void {
  const validatorFunc = fieldValidators[identifier];

  const isFieldValid = validatorFunc(fieldVal);
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

    // may not even try to validate tagInput, and probably don't need to validate tagsList
    /*
    let validTags;
    // tags is not a required field
    if (state.tagsList.length > 0) {
      validTags = tagsValidator(state.inputs.tagsList);
    }
    */

    let validDate = dateValidator(state.inputs.date);

    // want to set some errors too
    if (
      validDescription.error ||
      validAmount.error ||
      validDate.error
      // (validTags && !validTags.error) ||
    ) {
      let errors: FormErrorState = {};

      // refactor to clear errors if one already exists for the field, but the field itself has been updated to a valid input before su
      if (validDescription.error && validDescription.message) {
        errors.description = validDescription.message;
      }
      if (validAmount.error && validAmount.message) {
        errors.amount = validAmount.message;
      }
      // if (validTags && validTags.error && validTags.message) {
      //   errors.tags = validTags.message;
      // }
      if (validDate.error && validDate.message) {
        errors.date = validDate.message;
      }
      console.log("awa errors?", errors);
      send({ type: "SET_ERRORS", payload: { errors } });
      return;
    }
    console.log("are we executing?");
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

  const addTag = (event: React.FormEvent) => {
    event.preventDefault();
    // if tagInput is falsey (so either an empty string or undefined), immediately return when "Add Tag" button is clicked
    if (!state.inputs.tagInput) return;
    // if trying to add a blank input (empty string, multiple spaces, a tab character, etc.), clear the input
    if (isEmptyString(state.inputs.tagInput)) {
      send({ type: "CHANGE", payload: { value: "" } });
      return;
    }
    // if the current input trying to be added to tagsList is not already contained
    // (after trimming and converting to lowercase), then add the tagInput to tagsList
    if (!containsDuplicates(state.inputs.tagInput, state.tagsList)) {
      send({ type: "ADD_TAG" });
      return;
    }

    // else populate error state
    // ...add error handling
  };

  const removeTag = (event: React.FormEvent, removedTag: string) => {
    event.preventDefault();
    send({ type: "REMOVE_TAG", payload: { value: removedTag } });
  };

  console.log("state", state);
  return (
    <form className="transaction-form-container" onSubmit={handleSubmit}>
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
            errorMsg={state.errors[item.identifier]}
            blurHandler={() => {}}
            addTag={addTag}
            removeTag={removeTag}
            tagsList={state.tagsList}
          />
        );
      })}
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
  value: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  labelContent: string;
  errorMsg?: string;
  blurHandler: (inputVal: string) => void;
  addTag: (event: React.FormEvent) => void;
  removeTag: (event: React.FormEvent, value: string) => void;
  tagsList: string[];
}

const TransactionField: React.FC<ITransactionFieldProps> = ({
  id,
  name,
  type = "text",
  value,
  handleChange,
  disabled,
  labelContent,
  errorMsg,
  blurHandler,
  addTag,
  removeTag,
  tagsList,
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
        onBlur={() => blurHandler(value)}
      />
      {errorMsg && <p className="transaction-form-error">{errorMsg}</p>}
      {name === "tagInput" && (
        <TagCombinedField
          addTag={addTag}
          removeTag={removeTag}
          tagsList={tagsList}
        />
      )}
    </div>
  );
};

interface TagCombinedFieldProps {
  tagsList: string[];
  addTag: (event: React.FormEvent) => void;
  removeTag: (event: React.FormEvent, value: string) => void;
}

const TagCombinedField: React.FC<TagCombinedFieldProps> = ({
  addTag,
  removeTag,
  tagsList,
}) => {
  return (
    <>
      <button onClick={addTag}>Add Tag</button>
      {tagsList.length > 0 && (
        <ul className="transaction-tag-list">
          {tagsList.map((tag) => {
            return (
              <li key={tag} className="transaction-tag-list-item">
                <div>
                  {tag}{" "}
                  <button
                    type="button"
                    onClick={(event) => removeTag(event, tag)}
                  >
                    X
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

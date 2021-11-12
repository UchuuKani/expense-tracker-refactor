import React, { useReducer } from "react";

const simpleMachine = {
  initial: "active",
  states: {
    active: { on: { TOGGLE: "inactive" } },
    inactive: { on: { TOGGLE: "active" } },
  },
};

const reducer = (state, event) => {
  return simpleMachine.states[state].on?.[event.type] ?? state;
};

export const SimpleComponentNoContext: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, simpleMachine.initial);

  return <div>Hello vanilla test</div>;
};

const simpleMachineWithContext = {
  initial: "active",
  states: {
    active: {
      on: {
        TOGGLE: {
          target: "inactive",
          assign: (ctx) => ({ ...ctx, count: ctx.count + 1 }),
        },
      },
    },
    inactive: { on: { TOGGLE: "active" } },
  },
};

const reducerWithContext = (state, event) => {
  const transition =
    simpleMachine.states[state.value].on?.[event.type] ?? state.value;

  // No external state updates
  if (typeof transition === "string") {
    return {
      ...state,
      value: transition,
    };
  }

  // External state updates
  return {
    ...state,
    value: transition.target ?? state.value,
    ...transition.assign?.(state),
  };
};

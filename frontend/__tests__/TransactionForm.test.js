import React from "react";
import { render, screen } from "@testing-library/react";

import TransactionForm from "../src/components/TransactionForm";

describe("Transaction Form render", () => {
  it("renders labels for Description, Amount, Tags, and Date", () => {
    render(<TransactionForm />);

    const descriptionInput = screen.getByLabelText("Description:");
    const amountInput = screen.getByLabelText("Amount:");
    const tagsInput = screen.getByLabelText("Tags:");
    const dateInput = screen.getByLabelText("Date:");

    expect(descriptionInput).toBeInTheDocument();
    expect(amountInput).toBeInTheDocument();
    expect(tagsInput).toBeInTheDocument();
    expect(dateInput).toBeInTheDocument();
  });
});

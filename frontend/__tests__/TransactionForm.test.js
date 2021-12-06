import React from "react";
import { render, screen } from "@testing-library/react";

import TransactionForm from "../src/components/TransactionForm";

describe("Transaction Form render", () => {
  it("renders labels for Description, Amount, Tags, and Date", () => {
    render(<TransactionForm />);

    const descriptionLabel = screen.getByText("Description:");
    const amountLabel = screen.getByText("Amount:");
    const tagsLabel = screen.getByText("Tags:");
    const dateLabel = screen.getByText("Date:");

    expect(descriptionLabel).toBeInTheDocument();
    expect(amountLabel).toBeInTheDocument();
    expect(tagsLabel).toBeInTheDocument();
    expect(dateLabel).toBeInTheDocument();
  });
});

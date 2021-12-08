import React from "react";

const TransactionTable: React.FC = (props) => {
  return (
    <table role="grid">
      {/* thead used to contain the header cells */}
      <thead>
        {/* header row */}
        <tr>
          <th scope="col">Description</th>
          <th scope="col">Amount</th>
          <th scope="col">Date</th>
          <th scope="col">Tags</th>
        </tr>
      </thead>
      {/* tbody used to contain the content/non-header cells? */}
      <tbody>
        {/* test row content */}
        <tr>
          <td>Food</td>
          <td>$15.00</td>
          <td>Wed Dec 08 2021 17:59:47 GMT-0500 (Eastern Standard Time)</td>
          <td>Groceries</td>
        </tr>
      </tbody>
    </table>
  );
};

export default TransactionTable;

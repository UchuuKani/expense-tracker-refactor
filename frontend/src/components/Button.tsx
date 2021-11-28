import React from "react";

interface IProps {
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const Button: React.FC<IProps> = ({ children, handleClick }) => (
  <button className="button-base" onClick={handleClick}>
    {children}
  </button>
);

export default Button;

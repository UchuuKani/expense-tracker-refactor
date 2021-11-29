import React from "react";

type ButtonTypes = "button" | "submit" | "reset" | undefined;

interface IProps {
  handleClick?: (event: React.MouseEvent<HTMLElement>) => void;
  type?: ButtonTypes;
  style?: React.CSSProperties;
  classes?: string;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
}

const Button: React.FC<IProps> = ({
  children,
  handleClick,
  type = "button",
  style = {},
  classes = "",
}) => (
  <button
    type={type}
    className={`button-base ${classes}`}
    style={style}
    onClick={handleClick}
  >
    {children}
  </button>
);

export default Button;

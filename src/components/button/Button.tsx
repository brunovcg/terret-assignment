import type { PropsWithChildren } from "react";
import "./Button.css";

type Props = PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>;

export function Button({ children, ...rest }: Props) {
  return (
    <button {...rest} className="button">
      {children}
    </button>
  );
}

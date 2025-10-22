import type { PropsWithChildren } from "react";
import "./Button.css";
import { ClassNameUtils } from "../../utils/class-name/className.utils";

type Props = PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>;

export function Button({ children, className, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={ClassNameUtils.merge("button-component", className)}
    >
      {children}
    </button>
  );
}

import { createElement, type JSX, type PropsWithChildren } from "react";
import "./Typography.css";
import { mergeClass } from "../../utils/class-name/className.utils";
import { colorsVariants, type ColorsVariant } from "../../styles/colorsVariant";

export type TextSize = "small" | "regular" | "large";
export type TextAlign = "left" | "right" | "center" | "justify";

type Props = PropsWithChildren<{
  size?: TextSize;
  align?: TextAlign;
  italic?: boolean;
  bold?: boolean;
  variant?: ColorsVariant;
  as?: keyof JSX.IntrinsicElements;
}>;

export function Typography({
  children,
  variant,
  size = "regular",
  align,
  italic,
  bold,
  as = "p",
}: Readonly<Props>) {
  const classes = mergeClass("typography-component", {
    [`typography-size-${size}`]: !!size,
    [`typography-align-${align}`]: !!align,
    ["typography-bold"]: !!bold,
    ["im-typography-italic"]: !!italic,
  });

  const Tag = as;

  const contentStyle = {
    color: colorsVariants[variant ?? "primary"],
  };

  return createElement(Tag, {
    className: classes,
    style: contentStyle,
    children,
  });
}

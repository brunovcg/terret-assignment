import type { PropsWithChildren } from "react";
import "./ScrollableContainer.css";
import { ClassNameUtils } from "../../utils/class-name/className.utils";

type Props = { className: string };

export function ScrollableContainer({
  children,
  className,
}: PropsWithChildren<Props>) {
  return (
    <div
      className={ClassNameUtils.merge(
        "scrollable-container-component",
        className,
      )}
    >
      {children}
    </div>
  );
}

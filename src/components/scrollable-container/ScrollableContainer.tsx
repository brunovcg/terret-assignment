import type { PropsWithChildren } from "react";
import "./ScrollableContainer.css";

export function ScrollableContainer({ children }: PropsWithChildren) {
  return <div className="scrollable-container-component">{children}</div>;
}

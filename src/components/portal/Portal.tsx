import {
  useLayoutEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { createPortal } from "react-dom";

export type PortalProps = PropsWithChildren<{
  className?: string;
  targetId: string;
}>;

export function Portal({ children, className, targetId }: PortalProps) {
  const ref = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    ref.current = document.getElementById(targetId);
    setMounted(true);
  }, [targetId]);

  const shouldRender = !!mounted && !!ref.current;

  if (className) {
    return shouldRender
      ? createPortal(
          <div className={className}>{children}</div>,
          ref.current as Element,
        )
      : null;
  }

  return shouldRender ? createPortal(children, ref.current as Element) : null;
}

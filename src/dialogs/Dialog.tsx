import type { PropsWithChildren, ReactNode } from "react";
import type { DialogId } from "./types";
import { dialogController } from "./controller";
import { Icon } from "../components/icon/Icon";
import { Button } from "../components/button/Button";
import "./Dialog.css";
import { Typography } from "../components/typography/Typography";

interface DialogProps extends PropsWithChildren {
  dialogId: DialogId;
  children: ReactNode;
  heading: string;
  width?: number;
}

function DialogContent({ children }: PropsWithChildren) {
  return <section className="dialog-content">{children}</section>;
}

function DialogFooter({ children }: PropsWithChildren) {
  return <section className="dialog-footer">{children}</section>;
}

export function Dialog({ dialogId, heading, children, width }: DialogProps) {
  const handleCloseDialog = () => {
    dialogController.close(dialogId);
  };

  return (
    <dialog id={`dialog-${dialogId}`} className="dialog-component" open>
      <div className="dialog-container" style={{ width: `${width ?? 400}px` }}>
        <div className="dialog-header">
          <Typography as="h2" size="title">
            {heading}
          </Typography>
          <Button onClick={handleCloseDialog}>
            <Icon icon="close" className="dialog-close-icon" />
          </Button>
        </div>
        {children}
      </div>
    </dialog>
  );
}

Dialog.Content = DialogContent;
Dialog.Footer = DialogFooter;

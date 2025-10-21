import type { PropsWithChildren, ReactNode } from "react";
import type { DialogId } from "./types";
import { dialog } from "./controller";
import { Icon } from "../components/icon/Icon";
import { Button } from "../components/button/Button";

interface DialogProps {
  dialogId: DialogId;
  children: ReactNode;
  heading: string;
}

function DialogContent({ children }: PropsWithChildren) {
  return <section className="dialog-content">{children}</section>;
}

function DialogFooter({ children }: PropsWithChildren) {
  return <section className="dialog-footer">{children}</section>;
}

export function Dialog({ dialogId, heading }: DialogProps) {
  const handleCloseDialog = () => {
    dialog.close(dialogId);
  };

  return (
    <dialog id={`dialog-${dialogId}`} className="dialog-component">
      <div className="dialog-header">
        <h2>{heading}</h2>
        <Button onClick={handleCloseDialog}>
          <Icon icon="close" />
        </Button>
      </div>
    </dialog>
  );
}

Dialog.Content = DialogContent;
Dialog.Footer = DialogFooter;

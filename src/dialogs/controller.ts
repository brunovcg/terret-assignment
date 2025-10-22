import type { RefObject } from "react";
import type {
  ConditionalProps,
  DialogItem,
  DialogListener,
  DialogId,
} from "./types";

class DialogController {
  private readonly listeners = new Set<DialogListener<DialogId, unknown>>();

  private openedDialogs: DialogItem<DialogId, unknown>[] = [];

  subscribe = (
    listener: DialogListener<DialogId, unknown>,
  ): (() => boolean) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): DialogItem<DialogId, unknown>[] => this.openedDialogs;

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.openedDialogs));
  }

  open<CurrentDialogId extends DialogId, ComponentRef>({
    id,
    props,
    ref,
  }: {
    id: CurrentDialogId;
    ref?: RefObject<ComponentRef>;
  } & ConditionalProps<CurrentDialogId>): void {
    this.openedDialogs = [
      ...this.openedDialogs.filter((item) => item.id !== id),
      { id, props, ref } as DialogItem<DialogId, ComponentRef>,
    ];
    this.notify();
  }

  close(id: DialogId): void {
    this.openedDialogs = this.openedDialogs.filter((item) => item.id !== id);
    this.notify();
  }
}

export const dialogController = new DialogController();

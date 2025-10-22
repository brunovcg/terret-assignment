import type { RefObject } from "react";
import type {
  ConditionalProps,
  DialogItem,
  DialogListener,
  DialogId,
} from "./types";
import { URLParamsUtils } from "../utils/url/urlParams.utils";

/**
 * In-memory dialog state manager.
 *
 * Keeps an ordered snapshot of currently opened dialogs, allows subscribers
 * to listen to state changes, and mirrors state to the URL by setting/clearing
 * the `dialog` query parameter.
 *
 * URL side-effects:
 * - On `open()`: URLParamsUtils.set("dialog", JSON.stringify({ id, props }))
 * - On `close()`: URLParamsUtils.clear("dialog")
 */
class DialogController {
  private readonly listeners = new Set<DialogListener<DialogId, unknown>>();

  private openedDialogs: DialogItem<DialogId, unknown>[] = [];

  /**
   * Subscribes to dialog state changes.
   *
   * The listener receives the full snapshot of opened dialogs on every change.
   *
   * @param listener - Callback invoked with the current snapshot.
   * @returns Unsubscribe function that removes the listener and returns `true` if it was present.
   */
  subscribe = (
    listener: DialogListener<DialogId, unknown>,
  ): (() => boolean) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  /**
   * Returns the current ordered list of opened dialogs (snapshot).
   */
  getSnapshot = (): DialogItem<DialogId, unknown>[] => this.openedDialogs;

  /**
   * Notifies all listeners with the latest snapshot (internal).
   */
  private notify(): void {
    this.listeners.forEach((listener) => listener(this.openedDialogs));
  }

  /**
   * Opens (or replaces) a dialog by `id`.
   *
   * If a dialog with the same `id` already exists, it is replaced (de-duped)
   * so the snapshot contains at most one entry per `id`.
   * After updating state, all listeners are notified and the URL `dialog`
   * query parameter is updated with `{ id, props }`.
   *
   * @typeParam CurrentDialogId - A valid dialog identifier.
   * @typeParam ComponentRef - Optional component ref type associated with the dialog.
   * @param id - Dialog identifier.
   * @param props - Dialog props constrained by `ConditionalProps` for the given `id`.
   * @param ref - Optional React ref to the dialog component instance.
   */
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

    URLParamsUtils.set("dialog", JSON.stringify({ id, props }));
  }

  /**
   * Closes the dialog with the given `id`, notifies listeners, and clears the
   * `dialog` query parameter from the URL.
   *
   * @param id - Dialog identifier to close.
   */
  close(id: DialogId): void {
    this.openedDialogs = this.openedDialogs.filter((item) => item.id !== id);
    this.notify();
    URLParamsUtils.clear("dialog");
  }
}

export const dialogController = new DialogController();

import { dialogs } from "./register";
import type { RefObject } from "react";

export type DialogId = keyof typeof dialogs;

export type ConditionalProps<CurrentDialogId extends DialogId> = Parameters<
  (typeof dialogs)[CurrentDialogId]
>[number] extends never
  ? { props?: Parameters<(typeof dialogs)[CurrentDialogId]>[number] }
  : { props: Parameters<(typeof dialogs)[CurrentDialogId]>[number] };

export type DialogItem<
  CurrentDialogId extends DialogId,
  ComponentRef = unknown,
> = {
  id: CurrentDialogId;
  ref?: RefObject<ComponentRef>;
} & ConditionalProps<CurrentDialogId>;

export type DialogListener<
  CurrentDialogId extends DialogId,
  ComponentRef = unknown,
> = (dialogs: DialogItem<CurrentDialogId, ComponentRef>[]) => void;

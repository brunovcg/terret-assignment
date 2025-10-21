import { type ComponentType, Fragment, useSyncExternalStore } from "react";
import { dialog } from "./controller";
import { dialogs } from "./register";
import { Portal } from "../components/portal/Portal";
import {
  CreateComponent,
  type AttributesOptionalChildren,
} from "../components/create-component/CreateComponent";

export function DialogProvider() {
  const openedDialogs = useSyncExternalStore(
    dialog.subscribe,
    dialog.getSnapshot,
  );

  return (
    <Portal targetId="dialog-root">
      {openedDialogs.map((item) => {
        const dialogComponent = dialogs[item.id as keyof typeof dialogs];

        return (
          <Fragment key={item.id}>
            <CreateComponent
              component={
                dialogComponent as unknown as ComponentType<AttributesOptionalChildren>
              }
              props={item.props as unknown as AttributesOptionalChildren}
            />
          </Fragment>
        );
      })}
    </Portal>
  );
}

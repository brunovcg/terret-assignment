import { type ComponentType, Fragment, useSyncExternalStore } from "react";
import { dialogController } from "./controller";
import { dialogs } from "./register";
import { Portal } from "../components/portal/Portal";
import {
  CreateComponent,
  type AttributesOptionalChildren,
} from "../components/create-component/CreateComponent";

export function DialogProvider() {
  const openedDialogs = useSyncExternalStore(
    dialogController.subscribe,
    dialogController.getSnapshot,
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

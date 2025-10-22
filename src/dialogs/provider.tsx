import {
  type ComponentType,
  Fragment,
  useEffect,
  useSyncExternalStore,
} from "react";
import { dialogController } from "./controller";
import { dialogs } from "./register";
import { Portal } from "../components/portal/Portal";
import {
  CreateComponent,
  type AttributesOptionalChildren,
} from "../components/create-component/CreateComponent";
import { URLParamsUtils } from "../utils/url/urlParams.utils";

export function DialogProvider() {
  const openedDialogs = useSyncExternalStore(
    dialogController.subscribe,
    dialogController.getSnapshot,
  );

  // Open dialog detailed on query params
  useEffect(() => {
    try {
      const params = URLParamsUtils.get("dialog");

      if (params) {
        const parsed = JSON.parse(params);
        dialogController.open(parsed);
      }
    } catch {
      return;
    }
  }, []);

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

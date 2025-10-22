import { getLocale } from "../../../locales/locales";
import { Dialog } from "../../Dialog";

const string = getLocale().planetDetailDialog;

export function PlanetDetailDialog() {
  return (
    <Dialog dialogId="PlanetDetailDialog" heading={string.title}>
      x
    </Dialog>
  );
}

import { getLocale } from "../../locales/locales";
import { Typography } from "../typography/Typography";
import "./Loading.css";

const strings = getLocale().loadingComponent;

export function Loading() {
  return (
    <div className="loading-component">
      <Typography bold align="center" size="large">
        {strings.loading}
      </Typography>
    </div>
  );
}

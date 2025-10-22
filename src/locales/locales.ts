import { translation as usTranslation } from "./enUS";

type Language = "enUS";

export function getLocale(language: Language = "enUS") {
  const languagesAdapter = {
    enUS: usTranslation,
  };

  return languagesAdapter[language];
}

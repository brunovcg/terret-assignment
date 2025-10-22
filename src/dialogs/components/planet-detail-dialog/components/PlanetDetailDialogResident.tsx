import { getLocale } from "../../../../locales/locales";
import type { StarWarsPerson } from "../../../../services/star-wars/starWars.api.types";
import { PlanetDetailData } from "./PlanetDetailData";

interface Props {
  resident: StarWarsPerson;
}

const string = getLocale().planetDetailDialog;

export function PlanetDetailDialogResident({ resident }: Props) {
  return (
    <div className="resident-card">
      <PlanetDetailData heading={string.name} value={resident.name} />
      <PlanetDetailData heading={string.height} value={resident.height} />
      <PlanetDetailData heading={string.mass} value={resident.mass} />
      <PlanetDetailData heading={string.gender} value={resident.gender} />
    </div>
  );
}

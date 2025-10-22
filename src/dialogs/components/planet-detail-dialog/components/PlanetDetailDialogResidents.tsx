import { Typography } from "../../../../components/typography/Typography";
import { getLocale } from "../../../../locales/locales";
import type { StarWarsPlanetWithResidents } from "../../../../services/star-wars/api/starWars.api.types";
import { PlanetDetailDialogResident } from "./PlanetDetailDialogResident";

const string = getLocale().planetDetailDialog;

interface Props {
  planetWithResidents: StarWarsPlanetWithResidents | null;
}

export function PlanetDetailDialogResidents({ planetWithResidents }: Props) {
  return (
    <div className="planet-residents">
      <Typography bold as="h3" align="center" size="large">
        {string.residents}
      </Typography>
      <div className="dialog-resident-cards">
        {planetWithResidents?.residents.map((resident) => (
          <PlanetDetailDialogResident resident={resident} key={resident.name} />
        ))}
      </div>
    </div>
  );
}

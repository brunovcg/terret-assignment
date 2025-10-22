import { Typography } from "../../../../components/typography/Typography";
import { getLocale } from "../../../../locales/locales";
import type { StarWarsPlanetWithResidents } from "../../../../services/star-wars/starWars.api.types";
import { NumberUtils } from "../../../../utils/number/number.utils";
import { PlanetDetailData } from "./PlanetDetailData";

interface Props {
  planetWithResidents: StarWarsPlanetWithResidents | null;
}

const string = getLocale().planetDetailDialog;

export function PlanetDetailDialogPlanetInfo({ planetWithResidents }: Props) {
  return planetWithResidents ? (
    <>
      <div className="planet-info">
        <Typography bold as="h3" align="center" size="large">
          {string.planet}
        </Typography>
        <div className="planet-info-data">
          <PlanetDetailData
            heading={string.name}
            value={planetWithResidents?.name}
          />
          <PlanetDetailData
            heading={string.climate}
            value={planetWithResidents?.climate}
          />
          <PlanetDetailData
            heading={string.gravity}
            value={planetWithResidents?.gravity}
          />
          <PlanetDetailData
            heading={string.orbitalPeriod}
            value={planetWithResidents?.orbital_period}
          />
          <PlanetDetailData
            heading={string.population}
            value={NumberUtils.format(
              planetWithResidents?.population,
            ).toString()}
          />
          <PlanetDetailData
            heading={string.rotationPeriod}
            value={planetWithResidents?.rotation_period}
          />
        </div>
      </div>
    </>
  ) : null;
}

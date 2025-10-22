import { useEffect, useMemo, useState } from "react";
import type { StarWarsPlanetWithResidents } from "../../api/starWars.api.types";
import { StarWarsService } from "../../api/starWars.api";

import {
  reduceResidentsData,
  type ReducedResidentData,
} from "../../utils/starWars.utils";

const starWarsService = new StarWarsService();

export function useStarWarsPlanetDetails(planetUrl: string) {
  const [planetWithResidents, setPlanetWithResidents] =
    useState<null | StarWarsPlanetWithResidents>(null);
  const [loading, setLoading] = useState(true);

  const reducedResidents: ReducedResidentData | null = useMemo(
    () => reduceResidentsData(planetWithResidents),
    [planetWithResidents],
  );

  useEffect(() => {
    starWarsService
      .getPlanetDetails(planetUrl)
      .then(setPlanetWithResidents)
      .finally(() => {
        setLoading(false);
      });
  }, [planetUrl]);

  return { loading, planetWithResidents, reducedResidents };
}

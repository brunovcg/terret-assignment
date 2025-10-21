import { useEffect, useMemo, useState } from "react";
import { StarWarsService } from "./starWars.api";
import type { Sort, StarWarsPlanet } from "./starWars.api.types";
import { comparePlanets, includesInsensitive } from "./startWars.utils";
import { INITIAL_FILTERS } from "./starWars.constants";

const starWarsService = new StarWarsService();

export function useStartWarsPlanets() {
  const [planets, setAllPlanets] = useState<StarWarsPlanet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const [sortBy, setSortBy] = useState<Sort | null>(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const setFilter = (key: keyof typeof INITIAL_FILTERS, value: string) =>
    setFilters((state) => ({ ...state, [key]: value }));

  const clearFilter = () => setFilters(INITIAL_FILTERS);
  const clearSort = () => setSortBy(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const all = await starWarsService.getAllPlanetPagesResults();
        if (isMounted) setAllPlanets(all);
      } catch (e) {
        if (isMounted) setError(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const planetsWithFilterAndSorting = useMemo(() => {
    const filtered = planets.filter(
      (planet) =>
        includesInsensitive(planet.climate ?? "", filters.climate) &&
        includesInsensitive(planet.terrain ?? "", filters.terrain),
    );

    if (!sortBy) return filtered;

    return filtered.slice().sort((a, b) => comparePlanets(a, b, sortBy));
  }, [planets, filters, sortBy]);

  return {
    planets: planetsWithFilterAndSorting,
    loading,
    error,
    setSortBy,
    clearSort,
    setFilter,
    clearFilter,
  } as const;
}

import { useCallback, useEffect, useMemo, useState } from "react";
import { StarWarsService } from "./starWars.api";
import type { Sort, StarWarsPlanet } from "./starWars.api.types";
import { comparePlanets, includesInsensitive } from "./startWars.utils";
import { INITIAL_FILTERS } from "./starWars.constants";
import { LocalStorageUtils } from "../../utils/local-storage/localStorage.utils";

const starWarsService = new StarWarsService();

export function useStartWarsPlanets() {
  const [planets, setAllPlanets] = useState<StarWarsPlanet[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>(
    LocalStorageUtils.get("favorites") ?? [],
  );

  // With more time we can also to direction: asc vs dsc
  const [sortBy, setSortBy] = useState<Sort | null>(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const setFilter = (key: keyof typeof INITIAL_FILTERS, value: string) =>
    setFilters((state) => ({ ...state, [key]: value }));

  const clearFilter = () => setFilters(INITIAL_FILTERS);
  const clearSort = () => setSortBy(null);

  const toggleFavorite = useCallback(
    (key: string) => {
      if (favorites.includes(key)) {
        setFavorites((state) => state.filter((item) => item !== key));
      } else {
        setFavorites((state) => [...state, key]);
      }
    },
    [favorites],
  );

  useEffect(() => {
    // Keep local storage updated
    LocalStorageUtils.set("favorites", favorites);
  }, [favorites]);

  useEffect(() => {
    starWarsService
      .getAllPlanetPagesResults()
      .then((result) => {
        setAllPlanets(result);
      })
      .finally(() => {
        setLoading(false);
      });
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
    setSortBy,
    clearSort,
    setFilter,
    clearFilter,
    filters,
    favorites,
    toggleFavorite,
  };
}

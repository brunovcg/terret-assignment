import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("./starWars.api", () => {
  class StarWarsService {
    async getAllPlanetPagesResults(): Promise<StarWarsPlanet[]> {
      return [];
    }
  }
  return { StarWarsService };
});

import { StarWarsService } from "../../api/starWars.api";
import { LocalStorageUtils } from "../../../../utils/local-storage/localStorage.utils";
import { useStartWarsPlanets } from "./useStarWarsPlanets";
import type { StarWarsPlanet } from "../../api/starWars.api.types";

const TATOOINE = "Tatooine";
const NABOO = "Naboo";
const HOTH = "Hoth";

// Sample planets (only the fields used by the hook are necessary)
const SAMPLE_PLANETS = [
  { name: TATOOINE, climate: "arid", terrain: "desert" },
  { name: NABOO, climate: "temperate", terrain: "grassy hills, swamps" },
  { name: HOTH, climate: "frozen", terrain: "tundra, ice caves" },
] as StarWarsPlanet[];

describe("useStartWarsPlanets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads planets on mount and flips loading to false", async () => {
    vi.spyOn(
      StarWarsService.prototype,
      "getAllPlanetPagesResults",
    ).mockResolvedValue(SAMPLE_PLANETS);
    vi.spyOn(LocalStorageUtils, "get").mockReturnValue([]);
    vi.spyOn(LocalStorageUtils, "set").mockImplementation(() => {});

    const { result } = renderHook(() => useStartWarsPlanets());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.planets).toHaveLength(3);
  });

  it("filters by climate and terrain", async () => {
    vi.spyOn(
      StarWarsService.prototype,
      "getAllPlanetPagesResults",
    ).mockResolvedValue(SAMPLE_PLANETS);
    vi.spyOn(LocalStorageUtils, "get").mockReturnValue([]);
    vi.spyOn(LocalStorageUtils, "set").mockImplementation(() => {});

    const { result } = renderHook(() => useStartWarsPlanets());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.planets.map((p) => p.name)).toEqual([
      TATOOINE,
      NABOO,
      HOTH,
    ]);

    act(() => {
      result.current.setFilter("climate", "arid");
    });

    expect(result.current.planets.map((p) => p.name)).toEqual([TATOOINE]);

    act(() => {
      result.current.clearFilter();
      result.current.setFilter("terrain", "tundra");
    });

    expect(result.current.planets.map((p) => p.name)).toEqual([HOTH]);
  });

  it("toggles favorites, persists to localStorage and supports onlyFavorites filter", async () => {
    vi.spyOn(
      StarWarsService.prototype,
      "getAllPlanetPagesResults",
    ).mockResolvedValue(SAMPLE_PLANETS);
    vi.spyOn(LocalStorageUtils, "get").mockReturnValue([]);
    const setSpy = vi
      .spyOn(LocalStorageUtils, "set")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useStartWarsPlanets());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.toggleFavorite(TATOOINE);
    });

    expect(setSpy).toHaveBeenCalledWith("favorites", [TATOOINE]);

    act(() => {
      result.current.toggleSetOnlyFavorites();
    });

    expect(result.current.onlyFavorites).toBe(true);
    expect(result.current.planets.map((p) => p.name)).toEqual([TATOOINE]);

    act(() => {
      result.current.toggleFavorite(TATOOINE);
    });

    expect(result.current.planets).toEqual([]);
  });

  it("clearSort() and clearFilter() are stable no-throws", async () => {
    vi.spyOn(
      StarWarsService.prototype,
      "getAllPlanetPagesResults",
    ).mockResolvedValue(SAMPLE_PLANETS);
    vi.spyOn(LocalStorageUtils, "get").mockReturnValue([]);
    vi.spyOn(LocalStorageUtils, "set").mockImplementation(() => {});

    const { result } = renderHook(() => useStartWarsPlanets());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(() =>
      act(() => {
        result.current.clearFilter();
        result.current.clearSort();
      }),
    ).not.toThrow();
  });
});

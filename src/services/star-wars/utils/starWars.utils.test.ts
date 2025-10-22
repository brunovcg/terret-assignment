import { filterAndSortPlanets } from "./starWars.utils";
import type { Sort, StarWarsPlanet } from "../api/starWars.api.types";
import { INITIAL_FILTERS } from "../starWars.constants";

function makePlanet(
  name: string,
  climate: string,
  terrain: string,
  population: string,
): StarWarsPlanet {
  return {
    name,
    climate,
    terrain,
    population,
    url: `https://swapi.dev/api/planets/${name}/`,
  } as unknown as StarWarsPlanet;
}
import { describe, it, expect } from "vitest";

import { reduceResidentsData } from "./starWars.utils";
import type {
  StarWarsPerson,
  StarWarsPlanetWithResidents,
} from "../api/starWars.api.types";

function buildPlanet(residents: StarWarsPerson[]): StarWarsPlanetWithResidents {
  return {
    name: "Test Planet",
    url: "https://swapi.dev/api/planets/1/",
    residents,
  } as unknown as StarWarsPlanetWithResidents;
}

describe("useStarWarsPlanetDetails.utils > reduceResidentsData", () => {
  it("returns null when input is null or has no residents", () => {
    expect(reduceResidentsData(null)).toBeNull();
    expect(reduceResidentsData(buildPlanet([]))).toBeNull();
  });

  it("computes gender counts, height histogram (sorted), and averages; ignores invalid/<=0", () => {
    const planet = buildPlanet([
      { gender: "male", height: "180", mass: "80" },
      { gender: "female", height: "165", mass: "55" },
      { gender: "n/a", height: "unknown", mass: "unknown" },
      { gender: "", height: "0", mass: "-10" },
      { gender: "male", height: "180", mass: "90" },
    ] as StarWarsPerson[]);

    const reduced = reduceResidentsData(planet)!;

    const genderMap = Object.fromEntries(
      reduced.gender.labels.map((label, idx) => [
        label,
        reduced.gender.datasets[0].data[idx],
      ]),
    );

    expect(genderMap).toMatchObject({
      male: 2,
      female: 1,
      "n/a": 1,
      unknown: 1,
    });

    expect(reduced.height).toEqual([
      { xAxis: "165 cm", yAxis: 1 },
      { xAxis: "180 cm", yAxis: 2 },
    ]);

    expect(reduced.averageHeight).toBe(175);
    expect(reduced.averageMass).toBe(75);
  });

  it("handles partial numeric parsing and rounding rules (ignores invalid and <=0)", () => {
    const planet = buildPlanet([
      { gender: "male", height: "100", mass: "50" },
      { gender: "female", height: "200", mass: "unknown" },
      { gender: "other", height: "-1", mass: "0" },
      { gender: "unknown", height: "NaN", mass: "NaN" },
    ] as StarWarsPerson[]);

    const reduced = reduceResidentsData(planet)!;

    expect(reduced.height).toEqual([
      { xAxis: "100 cm", yAxis: 1 },
      { xAxis: "200 cm", yAxis: 1 },
    ]);

    expect(reduced.averageHeight).toBe(150);
    expect(reduced.averageMass).toBe(50);
  });

  it("rounds averages to two decimals", () => {
    const planet = buildPlanet([
      { gender: "male", height: "170.444", mass: "80.333" },
      { gender: "female", height: "170.445", mass: "90.666" },
    ] as StarWarsPerson[]);

    const reduced = reduceResidentsData(planet)!;

    expect(reduced.averageHeight).toBe(170.44);
    expect(reduced.averageMass).toBe(85.5);
  });
});

describe("starWars.utils > filterAndSortPlanets", () => {
  it("filters by climate and terrain (case-insensitive)", () => {
    const planets: StarWarsPlanet[] = [
      makePlanet("Tatooine", "Arid", "Desert", "200000"),
      makePlanet("Naboo", "Temperate", "Forests, Hills", "4500000000"),
      makePlanet("Hoth", "Frozen", "Tundra, Ice Caves", "unknown"),
    ];

    const filters = {
      climate: "arid",
      terrain: "desert",
    };
    const out = filterAndSortPlanets({
      planets,
      filters: filters as typeof INITIAL_FILTERS,
      onlyFavorites: false,
      favoritesSet: new Set<string>(),
      sortBy: null,
    });

    expect(out.map((p) => p.name)).toEqual(["Tatooine"]);
  });

  it("optionally filters by favorites when onlyFavorites is true", () => {
    const planets: StarWarsPlanet[] = [
      makePlanet("Tatooine", "Arid", "Desert", "200000"),
      makePlanet("Naboo", "Temperate", "Forests, Hills", "4500000000"),
      makePlanet("Hoth", "Frozen", "Tundra, Ice Caves", "unknown"),
    ];

    const filters: typeof INITIAL_FILTERS = {
      climate: "",
      terrain: "",
    } as typeof INITIAL_FILTERS;
    const favorites = new Set(["tatooine", "hoth"]);

    const out = filterAndSortPlanets({
      planets,
      filters,
      onlyFavorites: true,
      favoritesSet: favorites,
      sortBy: null,
    });

    expect(out.map((p) => p.name)).toEqual(["Tatooine", "Hoth"]);
  });

  it("sorts by name when sortBy is 'name'", () => {
    const planets: StarWarsPlanet[] = [
      makePlanet("Naboo", "Temperate", "Forests", "4500000000"),
      makePlanet("Tatooine", "Arid", "Desert", "200000"),
      makePlanet("Alderaan", "Temperate", "Mountains", "2000000000"),
    ];

    const filters: typeof INITIAL_FILTERS = {
      climate: "",
      terrain: "",
    } as typeof INITIAL_FILTERS;

    const out = filterAndSortPlanets({
      planets,
      filters,
      onlyFavorites: false,
      favoritesSet: new Set<string>(),
      sortBy: "name" as Sort,
    });

    expect(out.map((p) => p.name)).toEqual(["Alderaan", "Naboo", "Tatooine"]);
  });

  it("sorts numerically by population and pushes non-numeric to the end", () => {
    const planets: StarWarsPlanet[] = [
      makePlanet("X", "any", "any", "100,000"),
      makePlanet("Y", "any", "any", "5"),
      makePlanet("Z", "any", "any", "unknown"),
    ];

    const filters: typeof INITIAL_FILTERS = {
      climate: "",
      terrain: "",
    } as typeof INITIAL_FILTERS;

    const out = filterAndSortPlanets({
      planets,
      filters,
      onlyFavorites: false,
      favoritesSet: new Set<string>(),
      sortBy: "population" as Sort,
    });

    expect(out.map((p) => p.name)).toEqual(["Y", "X", "Z"]);
  });
});

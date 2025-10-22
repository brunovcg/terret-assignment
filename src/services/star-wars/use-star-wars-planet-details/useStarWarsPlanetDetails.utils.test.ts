import { describe, it, expect } from "vitest";
import { reduceResidentsData } from "./useStarWarsPlanetDetails.utils";
import type {
  StarWarsPerson,
  StarWarsPlanetWithResidents,
} from "../starWars.api.types";

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

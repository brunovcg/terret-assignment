import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const buildPlanetWithResidents = (residents: StarWarsPerson[]) => ({
  name: "Test Planet",
  url: "https://swapi.dev/api/planets/1/",
  residents,
});

vi.mock("../starWars.api", () => {
  class StarWarsService {
    async getPlanetDetails(): Promise<StarWarsPlanetWithResidents> {
      return {
        name: "",
        url: "https://",
        residents: [],
      } as unknown as StarWarsPlanetWithResidents;
    }
  }
  return { StarWarsService };
});

import { StarWarsService } from "../../api/starWars.api";
import { useStarWarsPlanetDetails } from "./useStarWarsPlanetDetails";
import type {
  StarWarsPerson,
  StarWarsPlanetWithResidents,
} from "../../api/starWars.api.types";

describe("useStarWarsPlanetDetails", () => {
  const PLANET_URL = "https://swapi.dev/api/planets/1/";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches planet details and computes reducedResidents (gender counts, height histogram, averages)", async () => {
    const mockPlanet = buildPlanetWithResidents([
      { gender: "male", height: "180", mass: "80" },
      { gender: "female", height: "165", mass: "55" },
      { gender: "n/a", height: "unknown", mass: "unknown" },
      { gender: "", height: "0", mass: "-10" },
      { gender: "male", height: "180", mass: "90" },
    ] as StarWarsPerson[]);

    const spy = vi
      .spyOn(StarWarsService.prototype, "getPlanetDetails")
      .mockResolvedValue(mockPlanet as StarWarsPlanetWithResidents);

    const { result } = renderHook(() => useStarWarsPlanetDetails(PLANET_URL));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(PLANET_URL);

    expect(result.current.planetWithResidents).toBeTruthy();

    const reduced = result.current.reducedResidents!;
    expect(reduced).toBeTruthy();

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

  it("returns null reducedResidents when no residents", async () => {
    vi.spyOn(StarWarsService.prototype, "getPlanetDetails").mockResolvedValue(
      buildPlanetWithResidents([]) as StarWarsPlanetWithResidents,
    );

    const { result } = renderHook(() => useStarWarsPlanetDetails(PLANET_URL));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.reducedResidents).toBeNull();
  });

  it("handles partial numeric parsing and rounding rules (ignores invalid and <=0)", async () => {
    const mockPlanet = buildPlanetWithResidents([
      { gender: "male", height: "100", mass: "50" },
      { gender: "female", height: "200", mass: "unknown" },
      { gender: "other", height: "-1", mass: "0" },
      { gender: "unknown", height: "NaN", mass: "NaN" },
    ] as StarWarsPerson[]);

    vi.spyOn(StarWarsService.prototype, "getPlanetDetails").mockResolvedValue(
      mockPlanet as StarWarsPlanetWithResidents,
    );

    const { result } = renderHook(() => useStarWarsPlanetDetails(PLANET_URL));

    await waitFor(() => expect(result.current.loading).toBe(false));

    const reduced = result.current.reducedResidents!;

    expect(reduced.height).toEqual([
      { xAxis: "100 cm", yAxis: 1 },
      { xAxis: "200 cm", yAxis: 1 },
    ]);

    expect(reduced.averageHeight).toBe(150);

    expect(reduced.averageMass).toBe(50);
  });
});

import type {
  Sort,
  StarWarsPlanet,
  StarWarsPlanetWithResidents,
  StarWarsPerson,
} from "../api/starWars.api.types";

export function includesInsensitive(hay: string, needle: string) {
  if (!needle) return true;
  return hay.toLowerCase().includes(needle.toLowerCase());
}

// Asked AI to create
function safeNumber(value: string) {
  const number = parseInt((value ?? "").toString().replace(/,/g, ""), 10);
  return Number.isFinite(number) ? number : Number.NaN;
}

// Asked AI to create
export function comparePlanets(
  a: StarWarsPlanet,
  b: StarWarsPlanet,
  sort: Sort,
) {
  if (sort === "name") {
    return a.name.localeCompare(b.name, undefined);
  }

  const av = safeNumber(a[sort as keyof StarWarsPlanet] as string);
  const bv = safeNumber(b[sort as keyof StarWarsPlanet] as string);

  const aIsNaN = Number.isNaN(av);
  const bIsNaN = Number.isNaN(bv);

  if (aIsNaN && bIsNaN) return 0;
  if (aIsNaN) return 1;
  if (bIsNaN) return -1;

  const diff = av - bv;
  if (diff === 0) return 0;
  return diff;
}

export interface ReducedResidentData {
  gender: {
    datasets: { data: number[] }[];
    labels: string[];
  };
  height: { xAxis: string; yAxis: number }[];
  averageHeight: number | null;
  averageMass: number | null;
}

// Asked AI to create
function parseNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const raw =
    typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  if (!Number.isFinite(raw) || raw <= 0) return null;
  return raw;
}

/**
 * Aggregates and summarizes statistical data for a planet's residents.
 *
 * This function computes:
 * - **Gender distribution**: counts of each gender among residents.
 * - **Height histogram**: a frequency table of unique heights (sorted ascending).
 * - **Average height and mass**: computed from valid (>0) numeric entries only.
 *
 * Invalid, non-numeric, or non-positive (`<= 0`) height/mass values are ignored.
 * Missing or empty `gender` values are categorized as `"unknown"`.
 *
 * @param planetWithResidents - A planet object containing its residents, or `null`.
 * @returns
 *   A {@link ReducedResidentData} object containing:
 *   - `gender`: datasets and labels for gender distribution.
 *   - `height`: sorted list of `{ xAxis, yAxis }` objects for height counts.
 *   - `averageHeight` and `averageMass`: mean values rounded to two decimals.
 *   Returns `null` if there are no residents.
 *
 * @example
 * ```ts
 * const planet = {
 *   residents: [
 *     { gender: "male", height: "180", mass: "80" },
 *     { gender: "female", height: "165", mass: "55" },
 *     { gender: "n/a", height: "unknown", mass: "unknown" },
 *   ],
 * };
 *
 * const summary = reduceResidentsData(planet);
 * summary.gender.labels = ["male", "female", "n/a"]
 * summary.height = [{ xAxis: "165 cm", yAxis: 1 }, { xAxis: "180 cm", yAxis: 1 }]
 * summary.averageHeight = 172.5
 * summary.averageMass = 67.5
 * ```
 */
// Asked AI to create but had to refine BigO
export function reduceResidentsData(
  planetWithResidents: StarWarsPlanetWithResidents | null,
): ReducedResidentData | null {
  const residents = planetWithResidents?.residents;
  if (!residents || residents.length === 0) return null;

  let totalHeight = 0;
  let validHeightCount = 0;
  let totalMass = 0;
  let validMassCount = 0;

  const genderCounts: Record<string, number> = {};
  const heightCounts: Record<number, number> = {};

  residents.forEach((resident: StarWarsPerson) => {
    const genderKey = resident.gender || "unknown";
    genderCounts[genderKey] = (genderCounts[genderKey] || 0) + 1;

    const height = parseNumber(resident.height);
    if (height !== null) {
      heightCounts[height] = (heightCounts[height] || 0) + 1;
      totalHeight += height;
      validHeightCount++;
    }

    const mass = parseNumber(resident.mass);
    if (mass !== null) {
      totalMass += mass;
      validMassCount++;
    }
  });

  const genderLabels = Object.keys(genderCounts);
  const genderData = Object.values(genderCounts);

  const heightData = Object.keys(heightCounts)
    .map(Number)
    .sort((a, b) => a - b)
    .map((h) => ({ xAxis: `${h} cm`, yAxis: heightCounts[h]! }));

  const rawAverageHeight =
    validHeightCount > 0 ? totalHeight / validHeightCount : null;
  const rawAverageMass = validMassCount > 0 ? totalMass / validMassCount : null;

  const averageHeight =
    rawAverageHeight !== null ? Math.round(rawAverageHeight * 100) / 100 : null;
  const averageMass =
    rawAverageMass !== null ? Math.round(rawAverageMass * 100) / 100 : null;

  return {
    gender: { datasets: [{ data: genderData }], labels: genderLabels },
    height: heightData,
    averageHeight,
    averageMass,
  };
}

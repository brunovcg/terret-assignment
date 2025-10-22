import type {
  StarWarsPerson,
  StarWarsPlanetWithResidents,
} from "../starWars.api.types";

export interface ReducedResidentData {
  gender: {
    datasets: { data: number[] }[];
    labels: string[];
  };
  height: { xAxis: string; yAxis: number }[];
  averageHeight: number | null;
  averageMass: number | null;
}

function parseNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const raw =
    typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  if (!Number.isFinite(raw) || raw <= 0) return null;
  return raw;
}

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

import type { Sort, StarWarsPlanet } from "./starWars.api.types";

export function includesInsensitive(hay: string, needle: string) {
  if (!needle) return true;
  return hay.toLowerCase().includes(needle.toLowerCase());
}

function safeNumber(value: string) {
  const number = parseInt((value ?? "").toString().replace(/,/g, ""), 10);
  return Number.isFinite(number) ? number : Number.NaN;
}

export function comparePlanets(
  a: StarWarsPlanet,
  b: StarWarsPlanet,
  sort: Sort,
) {
  const { column, direction } = sort;

  if (column === "name") {
    const res = a.name.localeCompare(b.name, undefined);
    return direction === "asc" ? res : -res;
  }

  const av = safeNumber(a[column as keyof StarWarsPlanet] as string);
  const bv = safeNumber(b[column as keyof StarWarsPlanet] as string);

  const aIsNaN = Number.isNaN(av);
  const bIsNaN = Number.isNaN(bv);

  if (aIsNaN && bIsNaN) return 0;
  if (aIsNaN) return 1;
  if (bIsNaN) return -1;

  const diff = av - bv;
  if (diff === 0) return 0;
  return direction === "asc" ? diff : -diff;
}

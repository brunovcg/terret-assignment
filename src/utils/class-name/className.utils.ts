export type ClassValue = string | Record<string, boolean>;

export function mergeClass(...args: ClassValue[]): string {
  const classes: string[] = [];

  for (const arg of args) {
    if (!arg) continue;

    if (typeof arg === "string") {
      const trimmed = arg.trim();
      if (trimmed) classes.push(trimmed);
      continue;
    }

    if (typeof arg === "object") {
      for (const [key, value] of Object.entries(arg)) {
        if (value) classes.push(key);
      }
    }
  }

  return Array.from(new Set(classes)).join(" ");
}

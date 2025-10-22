type LocalStorageKey = "favorites";

export class LocalStorageUtils {
  static set(key: LocalStorageKey, value: unknown): void {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  }

  static get<T>(key: LocalStorageKey): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }

  static clear(key?: LocalStorageKey): void {
    if (key) {
      localStorage.removeItem(key);
    } else {
      localStorage.clear();
    }
  }
}

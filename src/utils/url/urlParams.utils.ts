export class URLParamsUtils {
  static set(key: string, value: string): string {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState({}, "", url.toString());
    return url.toString();
  }

  static get(key: string): string | null {
    const url = new URL(window.location.href);
    return url.searchParams.get(key);
  }

  static clear(): string {
    const url = new URL(window.location.href);
    url.search = "";
    window.history.replaceState({}, "", url.toString());
    return url.toString();
  }
}

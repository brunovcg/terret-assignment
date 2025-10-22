type ParamsKey = "dialog";

export class URLParamsUtils {
  static set(key: ParamsKey, value: string) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState({}, "", url.toString());
  }

  static get(key: ParamsKey): string | null {
    const url = new URL(window.location.href);
    return url.searchParams.get(key);
  }

  static clear(key: ParamsKey) {
    const url = new URL(window.location.href);
    url.searchParams.delete(key);
    window.history.replaceState({}, "", url.toString());
  }
}

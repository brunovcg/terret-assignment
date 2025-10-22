export class NumberUtils {
  static format(number: string | number) {
    const num = Number(number);

    if (Number.isNaN(num)) return number;

    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(num);
  }
}

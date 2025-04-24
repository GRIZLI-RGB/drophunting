export function formatLargeNumber(
  value: string | number,
  withCurrency = true,
): string {
  let numValue: number;

  if (typeof value === "string") {
    const cleanValue = value.replace(/[^0-9.]/g, "");
    numValue = parseFloat(cleanValue);

    if (isNaN(numValue)) {
      return value.toString();
    }
  } else {
    numValue = value;
  }

  let formatted: string;

  if (numValue >= 1_000_000_000) {
    formatted =
      (numValue / 1_000_000_000).toFixed(
        numValue % 1_000_000_000 === 0 ? 0 : 1,
      ) + "B";
  } else if (numValue >= 1_000_000) {
    formatted =
      (numValue / 1_000_000).toFixed(numValue % 1_000_000 === 0 ? 0 : 1) + "M";
  } else if (numValue >= 1_000) {
    formatted =
      (numValue / 1_000).toFixed(numValue % 1_000 === 0 ? 0 : 1) + "K";
  } else {
    formatted = numValue.toString();
  }

  formatted = formatted.replace(/\.0([BMK]|$)/, "$1");

  return withCurrency ? `$${formatted}` : formatted;
}

export function formatInvestmentAmount(value: string | number): string {
  return formatLargeNumber(value, true);
}

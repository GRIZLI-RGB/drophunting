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

export function parseInvestmentAmount(formattedValue: string): number {
  // Handle if the input is undefined, null, or empty
  if (!formattedValue) return 0;

  // Remove currency symbol and any spaces, commas or other non-essential characters
  const value = formattedValue.replace(/[$,\s]/g, "");

  // Parse based on suffix (case insensitive)
  if (/\d+\.?\d*[bB]$/.test(value)) {
    return parseFloat(value.replace(/[bB]$/, "")) * 1_000_000_000;
  } else if (/\d+\.?\d*[mM]$/.test(value)) {
    return parseFloat(value.replace(/[mM]$/, "")) * 1_000_000;
  } else if (/\d+\.?\d*[kK]$/.test(value)) {
    return parseFloat(value.replace(/[kK]$/, "")) * 1_000;
  } else {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
}

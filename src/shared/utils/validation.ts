import i18n from "i18next";

export function validateAmount(
  value: string,
  currencyType: "Fiat" | "Crypto" = "Fiat",
): {
  isValid: boolean;
  amount: number | null;
  error?: string;
} {
  const dotCount = (value.match(/\./g) || []).length;
  if (dotCount > 1) {
    return {
      isValid: false,
      amount: null,
      error: i18n.t("validation.onlyOneDecimalPoint"),
    };
  }

  const cleanValue = value.replace(/[^0-9.]/g, "");

  if (!cleanValue) {
    return {
      isValid: false,
      amount: null,
      error: i18n.t("validation.amountRequired"),
    };
  }

  const numValue = parseFloat(cleanValue);
  if (isNaN(numValue)) {
    return {
      isValid: false,
      amount: null,
      error: i18n.t("validation.enterValidNumber"),
    };
  }

  if (numValue < 1) {
    console.log({ numValue, cleanValue });
    return {
      isValid: false,
      amount: null,
      error: i18n.t("validation.amountMin"),
    };
  }

  const decimalPlaces = (cleanValue.split(".")[1] || "").length;
  if (decimalPlaces > 2) {
    return {
      isValid: false,
      amount: null,
      error: i18n.t("validation.maxTwoDecimalPlaces"),
    };
  }

  if (currencyType === "Fiat" && numValue > 2000) {
    return {
      isValid: false,
      amount: null,
      error: i18n.t("validation.maxFiatAmount"),
    };
  }

  if (currencyType === "Crypto" && numValue > 2000) {
    return {
      isValid: false,
      amount: null,
      error: i18n.t("validation.maxCryptoAmount"),
    };
  }

  return {
    isValid: true,
    amount: numValue,
  };
}

export function formatAmount(value: number): string {
  return value.toFixed(2);
}

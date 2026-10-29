import type { AppLanguage } from "./i18n";

export const getIntlLocale = (language: AppLanguage): string => {
  return language === "pl" ? "pl-PL" : "en-US";
};

export const getCurrencySymbol = (language: AppLanguage): string => {
  return language === "pl" ? "zł" : "PLN";
};

export const formatCurrencyPLN = (
  amount: number,
  language: AppLanguage,
): string => {
  return new Intl.NumberFormat(getIntlLocale(language), {
    style: "currency",
    currency: "PLN",
    currencyDisplay: "symbol",
  }).format(amount);
};

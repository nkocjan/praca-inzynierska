import dayjs, { Dayjs } from "dayjs";
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
  fractionDigits = 2,
): string => {
  return new Intl.NumberFormat(getIntlLocale(language), {
    style: "currency",
    currency: "PLN",
    currencyDisplay: "symbol",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
};

export const formatDate = (
  date: string | Date | Dayjs,
  language: AppLanguage,
  format = "D MMM YYYY",
): string => {
  return dayjs(date).locale(language).format(format);
};

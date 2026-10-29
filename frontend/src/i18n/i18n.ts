import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import dayjs from "dayjs";
import "dayjs/locale/pl";
import "dayjs/locale/en";

import plCommon from "./locales/pl/common.json";
import enCommon from "./locales/en/common.json";
import plNav from "./locales/pl/nav.json";
import enNav from "./locales/en/nav.json";
import plDashboard from "./locales/pl/dashboard.json";
import enDashboard from "./locales/en/dashboard.json";
import plAuth from "./locales/pl/auth.json";
import enAuth from "./locales/en/auth.json";
import plValidation from "./locales/pl/validation.json";
import enValidation from "./locales/en/validation.json";
import plExpenses from "./locales/pl/expenses.json";
import enExpenses from "./locales/en/expenses.json";
import plCategories from "./locales/pl/categories.json";
import enCategories from "./locales/en/categories.json";
import plBudgets from "./locales/pl/budgets.json";
import enBudgets from "./locales/en/budgets.json";
import plInformation from "./locales/pl/information.json";
import enInformation from "./locales/en/information.json";
import plSettings from "./locales/pl/settings.json";
import enSettings from "./locales/en/settings.json";

export type AppLanguage = "pl" | "en";
export const LANGUAGE_STORAGE_KEY = "app.language";

export const normalizeLanguage = (
  value: string | undefined | null,
): AppLanguage => {
  return value === "en" ? "en" : "pl";
};

const initialLanguage = normalizeLanguage(
  typeof window !== "undefined"
    ? localStorage.getItem(LANGUAGE_STORAGE_KEY)
    : null,
);

i18n.use(initReactI18next).init({
  resources: {
    pl: {
      common: plCommon,
      nav: plNav,
      dashboard: plDashboard,
      auth: plAuth,
      validation: plValidation,
      expenses: plExpenses,
      categories: plCategories,
      budgets: plBudgets,
      information: plInformation,
      settings: plSettings,
    },
    en: {
      common: enCommon,
      nav: enNav,
      dashboard: enDashboard,
      auth: enAuth,
      validation: enValidation,
      expenses: enExpenses,
      categories: enCategories,
      budgets: enBudgets,
      information: enInformation,
      settings: enSettings,
    },
  },
  lng: initialLanguage,
  fallbackLng: "pl",
  supportedLngs: ["pl", "en"],
  ns: [
    "common",
    "nav",
    "dashboard",
    "auth",
    "validation",
    "expenses",
    "categories",
    "budgets",
    "information",
    "settings",
  ],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

const applyLocaleSideEffects = (lng: AppLanguage) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  }
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;
  }
  dayjs.locale(lng);
};

applyLocaleSideEffects(initialLanguage);

i18n.on("languageChanged", lng => {
  applyLocaleSideEffects(normalizeLanguage(lng));
});

export default i18n;

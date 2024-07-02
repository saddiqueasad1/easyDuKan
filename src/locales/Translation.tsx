import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslations from "./resources/en.json";
import urTranslations from "./resources/ur.json"; // Add Urdu translations

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources: {
    en: { translation: enTranslations },
    ur: { translation: urTranslations },
  },
  lng: "en", // Set Urdu as the default language
  fallbackLng: "en", // Fallback language if translation not found
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

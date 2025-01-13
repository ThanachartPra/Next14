import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import your translations
import en from "@/public/locales/EN.json";
import th from "@/public/locales/TH.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    th: { translation: th },
  },
  lng: "th", // Default language
  fallbackLng: "th", // Fallback language if a key is missing
  interpolation: {
    escapeValue: false, // React already escapes by default
  },
});

export default i18n;

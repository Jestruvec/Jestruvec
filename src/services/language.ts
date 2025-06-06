import { getDOMElements } from "@/utils/DOMElements";
import { storageService } from "./storage";
import { Lang } from "@/types";
import { flattenObject } from "@/utils";

const createLanguageService = () => {
  const { i18nDOM } = getDOMElements();
  let currentLang: Lang = "en";
  const translations: Record<string, string> = {};

  const initLanguage = async () => {
    try {
      const langToLoad =
        (storageService.getItem("lang") as Lang) || currentLang;
      await loadLanguage(langToLoad);
    } catch (error) {
      throw error;
    }
  };

  const loadLanguage = async (lang: Lang) => {
    storageService.setItem("lang", lang);

    try {
      const res = await fetch(`./lang/${lang}.json`);

      if (!res.ok) throw new Error(`Failed to load language file: ${lang}`);

      const rawData = await res.json();
      const data = flattenObject(rawData);

      Object.keys(translations).forEach((key) => delete translations[key]);
      Object.assign(translations, data);

      currentLang = lang;
      updateTexts();
    } catch (error) {
      throw error;
    }
  };

  const updateTexts = () => {
    i18nDOM.forEach(translateElement);
  };

  const translateElement = (el: HTMLElement) => {
    const key = el.dataset.i18n!;
    const translation = translations[key] ?? `[${key}]`;

    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      if (el.hasAttribute("placeholder")) el.placeholder = translation;
    } else if (el instanceof HTMLImageElement && el.hasAttribute("alt")) {
      el.alt = translation;
    } else if (el.hasAttribute("title")) {
      el.title = translation;
      el.textContent = translation;
    } else {
      el.textContent = translation;
    }
  };

  const getCurrentLang = () => {
    return currentLang;
  };

  return { initLanguage, getCurrentLang, loadLanguage };
};

export const languageService = createLanguageService();

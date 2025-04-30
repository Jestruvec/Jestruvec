import { getDOMElements } from "@/utils/DOMElements";
import { storageService } from "./storage";

type Lang = "es" | "en";

const { i18nDOM } = getDOMElements();
let currentLang: Lang = "en";
const translations: Record<string, string> = {};

export async function initLanguage() {
  try {
    const savedLang = storageService.getItem("lang") as Lang | null;
    const langToLoad = savedLang || currentLang;
    await loadLanguage(langToLoad);
  } catch (error) {
    console.log(error);
  }
}

export async function loadLanguage(lang: Lang) {
  if (lang === currentLang) return;
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
}

export function updateTexts() {
  i18nDOM.forEach((el) => {
    const key = el.dataset.i18n!;
    const translation = translations[key] ?? `[${key}]`;

    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      if (el.hasAttribute("placeholder")) {
        el.placeholder = translation;
      }
    } else if (el instanceof HTMLImageElement && el.hasAttribute("alt")) {
      el.alt = translation;
    } else if (el.hasAttribute("title")) {
      el.title = translation;
      el.textContent = translation;
    } else {
      el.textContent = translation;
    }
  });
}

export function getCurrentLang() {
  return currentLang;
}

export function getTranslations() {
  return translations;
}

function flattenObject(
  obj: any,
  prefix = "",
  result: Record<string, string> = {}
) {
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null) {
      flattenObject(value, newKey, result);
    } else {
      result[newKey] = String(value);
    }
  }
  return result;
}

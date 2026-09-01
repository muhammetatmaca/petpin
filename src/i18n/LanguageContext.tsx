import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  LanguageInfo,
  TranslationSchema,
  TRANSLATIONS,
} from './translations';

const LANGUAGE_STORAGE_KEY = '@petpin_app_language_v1';

interface LanguageContextProps {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  t: (key: keyof TranslationSchema) => string;
  tObj: TranslationSchema;
  supportedLanguages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextProps | null>(null);

function detectDeviceLanguage(): SupportedLanguage {
  try {
    const locales = Localization.getLocales();
    if (locales && locales.length > 0) {
      const langCode = locales[0].languageCode?.toLowerCase();
      const match = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
      if (match) {
        return match.code;
      }
    }
  } catch (err) {
    console.warn('Could not detect device locale:', err);
  }
  return 'tr';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('tr');

  useEffect(() => {
    const initLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLang && SUPPORTED_LANGUAGES.some((l) => l.code === savedLang)) {
          setLanguageState(savedLang as SupportedLanguage);
        } else {
          const detected = detectDeviceLanguage();
          setLanguageState(detected);
          await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, detected);
        }
      } catch {
        setLanguageState('tr');
      }
    };
    initLanguage();
  }, []);

  const setLanguage = async (newLang: SupportedLanguage) => {
    try {
      setLanguageState(newLang);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    } catch (err) {
      console.error('Failed to persist language choice:', err);
    }
  };

  const tObj = TRANSLATIONS[language] || TRANSLATIONS.tr;

  const t = (key: keyof TranslationSchema): string => {
    return tObj[key] || TRANSLATIONS.en[key] || TRANSLATIONS.tr[key] || (key as string);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        tObj,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback safe return
    const fallbackObj = TRANSLATIONS.tr;
    return {
      language: 'tr' as SupportedLanguage,
      setLanguage: async () => {},
      t: (k: keyof TranslationSchema) => fallbackObj[k] || (k as string),
      tObj: fallbackObj,
      supportedLanguages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
};

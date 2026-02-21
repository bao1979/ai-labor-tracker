import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { en, zh, type Translations } from './locales';

export type Language = 'en' | 'zh';

const STORAGE_KEY = 'ai-labor-tracker-language';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
}

const translations: Record<Language, Translations> = {
  en,
  zh,
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load language preference from storage on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        // Use chrome.storage.local for browser extension
        if (typeof chrome !== 'undefined' && chrome.storage?.local) {
          const result = await chrome.storage.local.get(STORAGE_KEY);
          if (result[STORAGE_KEY] && (result[STORAGE_KEY] === 'en' || result[STORAGE_KEY] === 'zh')) {
            setLanguageState(result[STORAGE_KEY] as Language);
          }
        } else {
          // Fallback to localStorage for development
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored && (stored === 'en' || stored === 'zh')) {
            setLanguageState(stored as Language);
          }
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadLanguage();
  }, []);

  // Save language preference to storage
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    
    // Persist to storage
    try {
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.set({ [STORAGE_KEY]: lang });
      } else {
        localStorage.setItem(STORAGE_KEY, lang);
      }
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  }, []);

  // Don't render until language preference is loaded
  if (!isLoaded) {
    return null;
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

/**
 * Utility function to interpolate template strings
 * Example: interpolate("Hello {{name}}", { name: "World" }) => "Hello World"
 */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return values[key]?.toString() ?? `{{${key}}}`;
  });
}

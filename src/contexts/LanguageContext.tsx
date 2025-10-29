import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { i18nService, SupportedLanguage } from '../services/i18nService';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  formatNumber: (value: number, decimals?: number) => string;
  formatCurrency: (value: number) => string;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(i18nService.getLanguage());

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    i18nService.setLanguage(lang);
    setLanguageState(lang);
  }, []);

  // Load saved language on mount
  useEffect(() => {
    const savedLang = i18nService.loadLanguage();
    if (savedLang !== language) {
      setLanguageState(savedLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recreate value object whenever language changes
  const value: LanguageContextType = useMemo(() => {
    return {
      language,
      setLanguage,
      t: (key: string, fallback?: string) => i18nService.t(key, fallback),
      formatNumber: (value: number, decimals?: number) => i18nService.formatNumber(value, decimals),
      formatCurrency: (value: number) => i18nService.formatCurrency(value),
      formatDate: (date: Date) => i18nService.formatDate(date),
      formatTime: (date: Date) => i18nService.formatTime(date),
    };
  }, [language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

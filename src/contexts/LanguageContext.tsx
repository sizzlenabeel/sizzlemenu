import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/types/menu';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { consent } = useCookieConsent();
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('cookie-consent') === 'accepted'
      ? localStorage.getItem('menu-language')
      : null;
    return (stored === 'en' || stored === 'sv') ? stored : 'sv';
  });

  useEffect(() => {
    if (consent === 'accepted') localStorage.setItem('menu-language', language);
  }, [consent, language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
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

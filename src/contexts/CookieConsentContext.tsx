import { createContext, ReactNode, useContext, useState } from "react";

export type CookieConsent = "accepted" | "declined" | null;

const CONSENT_STORAGE_KEY = "cookie-consent";

interface CookieConsentContextType {
  consent: CookieConsent;
  acceptCookies: () => void;
  declineCookies: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

function readConsent(): CookieConsent {
  const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
  return stored === "accepted" || stored === "declined" ? stored : null;
}

function removeOptionalStorage() {
  localStorage.removeItem("menu-language");
  document.cookie = "sidebar:state=; path=/; max-age=0; SameSite=Lax";
}

export function hasCookieConsent() {
  return readConsent() === "accepted";
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent>(readConsent);

  const acceptCookies = () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, "accepted");
    setConsent("accepted");
  };

  const declineCookies = () => {
    removeOptionalStorage();
    localStorage.setItem(CONSENT_STORAGE_KEY, "declined");
    setConsent("declined");
  };

  return (
    <CookieConsentContext.Provider value={{ consent, acceptCookies, declineCookies }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  return context;
}

import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { useLanguage } from "@/contexts/LanguageContext";

export function CookieConsent() {
  const { consent, acceptCookies, declineCookies } = useCookieConsent();
  const { language } = useLanguage();

  if (consent !== null) return null;

  const copy = language === "en"
    ? {
        label: "Cookie consent",
        title: "Cookies and local storage",
        description:
          "We only use cookies and local storage to remember your settings, such as your chosen language. We don't save anything else or track how you use the site. You can use the menu without accepting. Your choice is saved on your device so we don't ask again.",
        decline: "Decline",
        accept: "Accept",
      }
    : {
        label: "Samtycke till cookies",
        title: "Cookies och lokal lagring",
        description:
          "Vi använder bara cookies och lokal lagring för att komma ihåg dina inställningar, till exempel valt språk. Vi sparar inget annat och spårar inte hur du använder sidan. Du kan använda menyn utan att acceptera. Ditt val sparas på din enhet så att vi inte frågar igen.",
        decline: "Avvisa",
        accept: "Acceptera",
      };

  return (
    <section
      aria-label={copy.label}
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-2xl border bg-card p-5 text-card-foreground shadow-2xl sm:p-6"
    >
      <div className="flex items-start gap-4">
        <div className="hidden rounded-full bg-primary/10 p-3 text-primary sm:block">
          <Cookie className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{copy.title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {copy.description}
          </p>
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={declineCookies}>
              {copy.decline}
            </Button>
            <Button type="button" onClick={acceptCookies}>
              {copy.accept}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

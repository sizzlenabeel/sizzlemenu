import { MessageCircle, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const contacts = [
  {
    icon: MessageCircle,
    href: "https://m.me/YOUR_PAGE",
    labelEn: "Messenger",
    labelSv: "Messenger",
  },
  {
    icon: Mail,
    href: "mailto:hello@sizzle.se",
    labelEn: "Email",
    labelSv: "E-post",
  },
  {
    icon: Phone,
    href: "tel:+46XXXXXXXXX",
    labelEn: "Call",
    labelSv: "Ring",
  },
];

export function ContactButtons() {
  const { language } = useLanguage();
  const isSwedish = language === "sv";
  const heading = isSwedish ? "Kontakta oss" : "Contact us";

  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <span className="text-sm font-medium text-muted-foreground">{heading}</span>
      <div className="flex gap-4">
        {contacts.map((c) => (
          <a
            key={c.href}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
              <c.icon className="h-5 w-5" />
            </div>
            <span className="text-xs">{isSwedish ? c.labelSv : c.labelEn}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

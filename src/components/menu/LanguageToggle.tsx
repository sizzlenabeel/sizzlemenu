import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-md border border-input bg-background">
      <button
        onClick={() => setLanguage('sv')}
        className={cn(
          "inline-flex items-center justify-center p-2 rounded-l-md transition-colors text-sm font-medium",
          language === 'sv' ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        )}
      >
        SV
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={cn(
          "inline-flex items-center justify-center p-2 rounded-r-md transition-colors text-sm font-medium",
          language === 'en' ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        )}
      >
        EN
      </button>
    </div>
  );
}

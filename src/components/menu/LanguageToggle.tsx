import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-full border border-black/10 bg-white p-1 shadow-sm" aria-label="Language">
      <button
        type="button"
        aria-label="Byt språk till svenska"
        aria-pressed={language === 'sv'}
        onClick={() => setLanguage('sv')}
        className={cn(
          "inline-flex items-center justify-center rounded-full px-3 py-2 transition-colors text-xs font-bold leading-4",
          language === 'sv' ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        )}
      >
        SV
      </button>
      <button
        type="button"
        aria-label="Change language to English"
        aria-pressed={language === 'en'}
        onClick={() => setLanguage('en')}
        className={cn(
          "inline-flex items-center justify-center rounded-full px-3 py-2 transition-colors text-xs font-bold leading-4",
          language === 'en' ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        )}
      >
        EN
      </button>
    </div>
  );
}

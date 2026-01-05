import { useLanguage } from '@/contexts/LanguageContext';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <ToggleGroup
      type="single"
      value={language}
      onValueChange={(value) => value && setLanguage(value as 'sv' | 'en')}
      className="border rounded-lg"
    >
      <ToggleGroupItem value="sv" className="px-3 text-sm font-medium">
        SV
      </ToggleGroupItem>
      <ToggleGroupItem value="en" className="px-3 text-sm font-medium">
        EN
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

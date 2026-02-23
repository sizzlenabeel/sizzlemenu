import { getISOWeek } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface WeekOption {
  week: number;
  label: string;
  isCurrent: boolean;
}

interface WeekSelectorProps {
  selectedWeek: number;
  onChange: (week: number) => void;
}

function generateWeekOptions(language: 'sv' | 'en'): WeekOption[] {
  const currentWeek = getCurrentWeek();
  const weekLabel = language === 'sv' ? 'Vecka' : 'Week';
  const currentLabel = language === 'sv' ? '(nuvarande)' : '(current)';

  const options: WeekOption[] = [];

  for (let i = 0; i < 5; i++) {
    let week = currentWeek - i;
    if (week <= 0) week += 52;
    const isCurrent = i === 0;

    options.push({
      week,
      label: `${weekLabel} ${week}${isCurrent ? ` ${currentLabel}` : ''}`,
      isCurrent,
    });
  }

  return options;
}

export function getCurrentWeek(): number {
  return getISOWeek(new Date());
}

export function WeekSelector({ selectedWeek, onChange }: WeekSelectorProps) {
  const { language } = useLanguage();
  const options = generateWeekOptions(language);

  return (
    <Select
      value={String(selectedWeek)}
      onValueChange={(value) => onChange(Number(value))}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.week}
            value={String(option.week)}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

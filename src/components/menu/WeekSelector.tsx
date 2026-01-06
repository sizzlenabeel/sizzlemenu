import { getISOWeek, getISOWeekYear, subWeeks } from "date-fns";
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
  year: number;
  label: string;
  isCurrent: boolean;
}

interface WeekSelectorProps {
  selectedWeek: { week: number; year: number };
  onChange: (week: { week: number; year: number }) => void;
}

function generateWeekOptions(language: 'sv' | 'en'): WeekOption[] {
  const now = new Date();
  const currentWeek = getISOWeek(now);
  const currentYear = getISOWeekYear(now);
  const weekLabel = language === 'sv' ? 'Vecka' : 'Week';
  const currentLabel = language === 'sv' ? '(nuvarande)' : '(current)';

  const options: WeekOption[] = [];

  for (let i = 0; i < 5; i++) {
    const date = subWeeks(now, i);
    const week = getISOWeek(date);
    const year = getISOWeekYear(date);
    const isCurrent = i === 0;

    options.push({
      week,
      year,
      label: `${weekLabel} ${week}${year !== currentYear ? ` (${year})` : ''}${isCurrent ? ` ${currentLabel}` : ''}`,
      isCurrent,
    });
  }

  return options;
}

export function getCurrentWeek(): { week: number; year: number } {
  const now = new Date();
  return {
    week: getISOWeek(now),
    year: getISOWeekYear(now),
  };
}

export function WeekSelector({ selectedWeek, onChange }: WeekSelectorProps) {
  const { language } = useLanguage();
  const options = generateWeekOptions(language);

  const handleChange = (value: string) => {
    const [week, year] = value.split('-').map(Number);
    onChange({ week, year });
  };

  return (
    <Select
      value={`${selectedWeek.week}-${selectedWeek.year}`}
      onValueChange={handleChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={`${option.week}-${option.year}`}
            value={`${option.week}-${option.year}`}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

import { DayOfWeek } from "@/types/menu";
import { cn } from "@/lib/utils";

interface DayTabsProps {
  selectedDay: DayOfWeek;
  onChange: (day: DayOfWeek) => void;
}

const days: { value: DayOfWeek; label: string; short: string }[] = [
  { value: 'monday', label: 'Monday', short: 'Mon' },
  { value: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { value: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { value: 'thursday', label: 'Thursday', short: 'Thu' },
  { value: 'friday', label: 'Friday', short: 'Fri' },
];

export function DayTabs({ selectedDay, onChange }: DayTabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-secondary rounded-xl">
      {days.map((day) => (
        <button
          key={day.value}
          onClick={() => onChange(day.value)}
          className={cn(
            "flex-1 px-2 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200",
            selectedDay === day.value
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
          )}
        >
          <span className="hidden sm:inline">{day.label}</span>
          <span className="sm:hidden">{day.short}</span>
        </button>
      ))}
    </div>
  );
}

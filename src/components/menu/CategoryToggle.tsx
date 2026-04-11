import { Category } from "@/types/menu";
import { cn } from "@/lib/utils";

interface CategoryToggleProps {
  value: Category;
  onChange: (category: Category) => void;
}

export function CategoryToggle({ value, onChange }: CategoryToggleProps) {
  return (
    <div className="flex rounded-lg bg-secondary p-1">
      <button
        onClick={() => onChange('food')}
        className={cn(
          "flex-1 px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200",
          value === 'food'
            ? "bg-food text-primary-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Food
      </button>
      <button
        onClick={() => onChange('snacks')}
        className={cn(
          "flex-1 px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200",
          value === 'snacks'
            ? "bg-food text-primary-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Snacks
      </button>
    </div>
  );
}

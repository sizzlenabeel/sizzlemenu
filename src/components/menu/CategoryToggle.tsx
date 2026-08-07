import { Category } from "@/types/menu";
import { cn } from "@/lib/utils";

interface CategoryToggleProps {
  value: Category;
  onChange: (category: Category) => void;
}

export function CategoryToggle({ value, onChange }: CategoryToggleProps) {
  const categories: { value: Category; label: string }[] = [
    { value: "food", label: "Food" },
    { value: "breakfast", label: "Breakfast" },
    { value: "snacks", label: "Snacks" },
    { value: "drinks", label: "Drinks" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 rounded-lg bg-secondary p-1">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onChange(category.value)}
          className={cn(
            "px-3 sm:px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200",
            value === category.value
              ? "bg-food text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}

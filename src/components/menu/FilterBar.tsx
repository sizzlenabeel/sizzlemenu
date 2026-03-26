import { MenuFilters, Category, SortOption } from "@/types/menu";
import { CategoryToggle } from "./CategoryToggle";
import { VeganToggle } from "./VeganToggle";
import { SortDropdown } from "./SortDropdown";
import { WeekSelector } from "./WeekSelector";

interface FilterBarProps {
  filters: MenuFilters;
  onFiltersChange: (filters: MenuFilters) => void;
  selectedWeek: number;
  onWeekChange: (week: number) => void;
}

export function FilterBar({ filters, onFiltersChange, selectedWeek, onWeekChange }: FilterBarProps) {
  const handleCategoryChange = (category: Category) => {
    onFiltersChange({ ...filters, category });
  };

  const handleVeganChange = (veganOnly: boolean) => {
    onFiltersChange({ ...filters, veganOnly });
  };

  const handleSortChange = (sortBy: SortOption) => {
    onFiltersChange({ ...filters, sortBy });
  };

  return (
    <div className="flex flex-col gap-3 mb-6">
      <CategoryToggle value={filters.category} onChange={handleCategoryChange} />
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <VeganToggle checked={filters.veganOnly} onChange={handleVeganChange} />
        <div className="flex items-center gap-3">
          <SortDropdown value={filters.sortBy} onChange={handleSortChange} />
          <WeekSelector selectedWeek={selectedWeek} onChange={onWeekChange} />
        </div>
      </div>
    </div>
  );
}

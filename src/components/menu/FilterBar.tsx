import { MenuFilters, Category, SortOption, ViewMode } from "@/types/menu";
import { CategoryToggle } from "./CategoryToggle";
import { VeganToggle } from "./VeganToggle";
import { SortDropdown } from "./SortDropdown";
import { ViewToggle } from "./ViewToggle";

interface FilterBarProps {
  filters: MenuFilters;
  onFiltersChange: (filters: MenuFilters) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function FilterBar({ filters, onFiltersChange, viewMode, onViewModeChange }: FilterBarProps) {
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
        <div className="flex items-center gap-3">
          <VeganToggle checked={filters.veganOnly} onChange={handleVeganChange} />
          <SortDropdown value={filters.sortBy} onChange={handleSortChange} />
        </div>
        <ViewToggle value={viewMode} onChange={onViewModeChange} />
      </div>
    </div>
  );
}

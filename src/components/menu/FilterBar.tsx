import { MenuFilters, Category, SortOption } from "@/types/menu";
import { CategoryToggle } from "./CategoryToggle";
import { VeganToggle } from "./VeganToggle";
import { SortDropdown } from "./SortDropdown";

interface FilterBarProps {
  filters: MenuFilters;
  onFiltersChange: (filters: MenuFilters) => void;
}

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
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
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
      <CategoryToggle value={filters.category} onChange={handleCategoryChange} />
      <div className="flex flex-wrap items-center gap-4">
        <VeganToggle checked={filters.veganOnly} onChange={handleVeganChange} />
        <SortDropdown value={filters.sortBy} onChange={handleSortChange} />
      </div>
    </div>
  );
}

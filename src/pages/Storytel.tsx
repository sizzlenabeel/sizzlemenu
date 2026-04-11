import { useState, useMemo } from "react";
import { DayOfWeek, MenuFilters, ViewMode } from "@/types/menu";
import { MenuHeader } from "@/components/menu/MenuHeader";
import { DayTabs } from "@/components/menu/DayTabs";
import { FilterBar } from "@/components/menu/FilterBar";
import { DishCard } from "@/components/menu/DishCard";
import { EmptyState } from "@/components/menu/EmptyState";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { ContactButtons } from "@/components/menu/ContactButtons";
import { CartBar } from "@/components/menu/CartBar";
import { getISOWeek } from "date-fns";

export default function Storytel() {
  const currentWeek = getISOWeek(new Date());
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('monday');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filters, setFilters] = useState<MenuFilters>({
    category: 'food',
    veganOnly: false,
    sortBy: 'dueDate',
  });

  const { data: allDishes, isLoading, error } = useProducts();

  const filteredDishes = useMemo(() => {
    if (!allDishes) return [];

    const now = new Date();

    let result = allDishes.filter((dish) => {
      if (!dish.isForStorytel && !dish.isOnlyForStorytel) return false;
      if (dish.dueDate < now) return false;
      if (dish.category !== filters.category) return false;
      if (filters.veganOnly && !dish.isVegan) return false;
      if (dish.weekNumber !== currentWeek) return false;
      if (dish.category === 'food' && dish.day !== selectedDay) return false;
      return true;
    });

    result.sort((a, b) => {
      if (filters.sortBy === 'price') return a.price - b.price;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    return result;
  }, [allDishes, selectedDay, currentWeek, filters]);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl py-8 px-4">
          <MenuHeader locationName="Storytel" subtitle="Daily rotating menu" viewMode={viewMode} onViewModeChange={setViewMode} />
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load menu. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8 px-4">
        <MenuHeader locationName="Storytel" subtitle="Daily rotating menu" viewMode={viewMode} onViewModeChange={setViewMode} />

        <div className="mb-4">
          <DayTabs selectedDay={selectedDay} onChange={setSelectedDay} />
        </div>

        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
        />

        <div className={viewMode === 'tile' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-4'}>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))
          ) : filteredDishes.length > 0 ? (
            filteredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} showPrice={dish.category === 'snacks'} showBuyButton={dish.category === 'snacks'} locationName="Storytel" viewMode={viewMode} />
            ))
          ) : (
            <EmptyState message={filters.category === 'snacks' ? 'No snacks available' : `No ${filters.category} available for ${selectedDay}`} />
          )}
        </div>

        <ContactButtons />
        <CartBar locationName="Storytel" />
      </div>
    </div>
  );
}

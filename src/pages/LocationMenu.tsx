import { useState, useMemo } from "react";
import { MenuFilters } from "@/types/menu";
import { MenuHeader } from "@/components/menu/MenuHeader";
import { FilterBar } from "@/components/menu/FilterBar";
import { DishCard } from "@/components/menu/DishCard";
import { EmptyState } from "@/components/menu/EmptyState";
import { getCurrentWeek } from "@/components/menu/WeekSelector";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { ContactButtons } from "@/components/menu/ContactButtons";

interface LocationMenuProps {
  locationName: string;
}

export default function LocationMenu({ locationName }: LocationMenuProps) {
  const [selectedWeek, setSelectedWeek] = useState<number>(getCurrentWeek);
  const [filters, setFilters] = useState<MenuFilters>({
    category: 'food',
    veganOnly: false,
    sortBy: 'dueDate',
  });

  const { data: allDishes, isLoading, error } = useProducts();

  const filteredDishes = useMemo(() => {
    if (!allDishes) return [];

    let result = allDishes.filter((dish) => {
      if (dish.isOnlyForStorytel) return false;
      if (dish.category !== filters.category) return false;
      if (filters.veganOnly && !dish.isVegan) return false;
      if (dish.weekNumber !== selectedWeek) return false;
      return true;
    });

    result.sort((a, b) => {
      if (filters.sortBy === 'price') return a.price - b.price;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    return result;
  }, [allDishes, selectedWeek, filters]);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl py-8 px-4">
          <MenuHeader locationName={locationName} subtitle="Weekly menu" />
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
        <MenuHeader locationName={locationName} subtitle="Weekly menu" />
        
        <FilterBar filters={filters} onFiltersChange={setFilters} selectedWeek={selectedWeek} onWeekChange={setSelectedWeek} />

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))
          ) : filteredDishes.length > 0 ? (
            filteredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} showBuyButton locationName={locationName} />
            ))
          ) : (
            <EmptyState message={`No ${filters.category} available`} />
          )}
        </div>

        <ContactButtons />
      </div>
    </div>
  );
}

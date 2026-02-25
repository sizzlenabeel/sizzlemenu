import { useState, useMemo } from "react";
import { DayOfWeek, MenuFilters } from "@/types/menu";
import { MenuHeader } from "@/components/menu/MenuHeader";
import { DayTabs } from "@/components/menu/DayTabs";
import { FilterBar } from "@/components/menu/FilterBar";
import { DishCard } from "@/components/menu/DishCard";
import { EmptyState } from "@/components/menu/EmptyState";
import { WeekSelector, getCurrentWeek } from "@/components/menu/WeekSelector";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

export default function Storytel() {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('monday');
  const [selectedWeek, setSelectedWeek] = useState<number>(getCurrentWeek);
  const [filters, setFilters] = useState<MenuFilters>({
    category: 'food',
    veganOnly: false,
    sortBy: 'dueDate',
  });

  const { data: allDishes, isLoading, error } = useProducts();

  const filteredDishes = useMemo(() => {
    if (!allDishes) return [];

    const now = new Date();

    // Storytel shows dishes that are for Storytel
    let result = allDishes.filter((dish) => {
      if (!dish.isForStorytel && !dish.isOnlyForStorytel) return false;
      if (dish.category !== filters.category) return false;
      if (filters.veganOnly && !dish.isVegan) return false;
      if (dish.weekNumber !== selectedWeek) return false;
      // Hide expired items
      if (dish.dueDate < now) return false;
      // Snacks show all week, food filters by day
      if (dish.category === 'food' && dish.day !== selectedDay) return false;
      return true;
    });

    result.sort((a, b) => {
      if (filters.sortBy === 'price') {
        return a.price - b.price;
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    return result;
  }, [allDishes, selectedDay, selectedWeek, filters]);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl py-8 px-4">
          <MenuHeader locationName="Storytel" subtitle="Daily rotating menu" />
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
        <MenuHeader 
          locationName="Storytel" 
          subtitle="Daily rotating menu" 
        />
        
        <div className="flex items-center justify-between gap-4 mb-4">
          <DayTabs selectedDay={selectedDay} onChange={setSelectedDay} />
          <WeekSelector selectedWeek={selectedWeek} onChange={setSelectedWeek} />
        </div>
        
        <div className="mt-6">
          <FilterBar filters={filters} onFiltersChange={setFilters} />
        </div>

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))
          ) : filteredDishes.length > 0 ? (
            filteredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} showPrice={dish.category === 'snacks'} />
            ))
          ) : (
            <EmptyState message={filters.category === 'snacks' ? 'No snacks available' : `No ${filters.category} available for ${selectedDay}`} />
          )}
        </div>
      </div>
    </div>
  );
}

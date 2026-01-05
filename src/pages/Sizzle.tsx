import { useState, useMemo } from "react";
import { Dish, MenuFilters } from "@/types/menu";
import { MenuHeader } from "@/components/menu/MenuHeader";
import { FilterBar } from "@/components/menu/FilterBar";
import { DishCard } from "@/components/menu/DishCard";
import { EmptyState } from "@/components/menu/EmptyState";

// Empty array - ready for backend connection
const dishes: Dish[] = [];

export default function Sizzle() {
  const [filters, setFilters] = useState<MenuFilters>({
    category: 'food',
    veganOnly: false,
    sortBy: 'price',
  });

  const filteredDishes = useMemo(() => {
    let result = dishes.filter((dish) => {
      if (dish.category !== filters.category) return false;
      if (filters.veganOnly && !dish.isVegan) return false;
      return true;
    });

    result.sort((a, b) => {
      if (filters.sortBy === 'price') {
        return a.price - b.price;
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    return result;
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8 px-4">
        <MenuHeader 
          locationName="Sizzle" 
          subtitle="Weekly menu" 
        />
        
        <FilterBar filters={filters} onFiltersChange={setFilters} />

        <div className="space-y-4">
          {filteredDishes.length > 0 ? (
            filteredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))
          ) : (
            <EmptyState message={`No ${filters.category} available`} />
          )}
        </div>
      </div>
    </div>
  );
}

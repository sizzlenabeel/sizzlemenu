import { useState, useMemo } from "react";
import { MenuFilters, DayOfWeek, ViewMode } from "@/types/menu";
import { MenuHeader } from "@/components/menu/MenuHeader";
import { FilterBar } from "@/components/menu/FilterBar";
import { DishCard } from "@/components/menu/DishCard";
import { EmptyState } from "@/components/menu/EmptyState";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { ContactButtons } from "@/components/menu/ContactButtons";
import { CartBar } from "@/components/menu/CartBar";
import { getISOWeek } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface LocationMenuProps {
  locationName: string;
}

const DAY_ORDER: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

function getTodayDayIndex(): number {
  const jsDay = new Date().getDay(); // 0=Sun, 1=Mon...6=Sat
  if (jsDay === 0 || jsDay === 6) return 4; // weekend → treat as friday (show everything)
  return jsDay - 1; // Mon=0, Tue=1, ...Fri=4
}

export default function LocationMenu({ locationName }: LocationMenuProps) {
  const currentWeek = getISOWeek(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filters, setFilters] = useState<MenuFilters>({
    category: 'food',
    veganOnly: false,
    sortBy: 'dueDate',
  });
  const { language } = useLanguage();
  const isSwedish = language === 'sv';

  const { data: allDishes, isLoading, error } = useProducts();

  const { available, upcoming } = useMemo(() => {
    if (!allDishes) return { available: [], upcoming: [] };

    const now = new Date();
    const todayIndex = getTodayDayIndex();

    const filtered = allDishes.filter((dish) => {
      if (dish.isOnlyForStorytel) return false;
      if (dish.dueDate < now) return false;
      if (dish.category !== filters.category) return false;
      if (filters.veganOnly && !dish.isVegan) return false;
      if (dish.weekNumber !== currentWeek) return false;
      return true;
    });

    const availableItems: typeof filtered = [];
    const upcomingItems: typeof filtered = [];

    for (const dish of filtered) {
      const deliveryDayIndex = dish.sizzleDeliveryDay
        ? DAY_ORDER.indexOf(dish.sizzleDeliveryDay)
        : -1;

      if (deliveryDayIndex === -1 || deliveryDayIndex <= todayIndex) {
        availableItems.push(dish);
      } else {
        upcomingItems.push(dish);
      }
    }

    const sortFn = (a: typeof filtered[0], b: typeof filtered[0]) => {
      if (filters.sortBy === 'price') return a.price - b.price;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    };

    availableItems.sort(sortFn);
    upcomingItems.sort((a, b) => {
      const aIdx = a.sizzleDeliveryDay ? DAY_ORDER.indexOf(a.sizzleDeliveryDay) : 99;
      const bIdx = b.sizzleDeliveryDay ? DAY_ORDER.indexOf(b.sizzleDeliveryDay) : 99;
      return aIdx - bIdx;
    });

    return { available: availableItems, upcoming: upcomingItems };
  }, [allDishes, currentWeek, filters]);

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
        <MenuHeader locationName={locationName} subtitle="Weekly menu" viewMode={viewMode} onViewModeChange={setViewMode} />

        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
        />

        <div className={viewMode === 'tile' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-4'}>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))
          ) : available.length > 0 ? (
            available.map((dish) => (
              <DishCard key={dish.id} dish={dish} showBuyButton locationName={locationName} viewMode={viewMode} />
            ))
          ) : (
            <EmptyState message={`No ${filters.category} available`} />
          )}
        </div>

        {!isLoading && upcoming.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-muted-foreground mb-4">
              {isSwedish ? 'Kommande leveranser' : 'Upcoming Deliveries'}
            </h2>
            <div className={viewMode === 'tile' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-4'}>
              {upcoming.map((dish) => (
                <DishCard key={dish.id} dish={dish} showBuyButton locationName={locationName} viewMode={viewMode} upcoming />
              ))}
            </div>
          </div>
        )}

        <ContactButtons />
        <CartBar locationName={locationName} />
      </div>
    </div>
  );
}

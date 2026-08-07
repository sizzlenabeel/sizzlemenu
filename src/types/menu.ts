export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export type ProductType = 'SNACK' | 'BREAKFAST' | 'FOOD' | 'DRINK';

export type Category = 'food' | 'snacks' | 'breakfast' | 'drinks';

export type SortOption = 'price' | 'dueDate';

export type Language = 'sv' | 'en';

export type ViewMode = 'list' | 'tile';

export interface Dish {
  id: string;
  numericId: number;
  name: string;
  description: string;
  ingredients: string[];
  allergens: string;
  consumptionGuidelines: string;
  price: number;
  dueDate: Date;
  showDueDate?: boolean;
  category: Category;
  categories: Category[];
  isVegan: boolean;
  day?: DayOfWeek;
  weekNumber?: number;
  imageUrl?: string;
  sizzleDeliveryDay?: DayOfWeek;
}

export interface MenuFilters {
  category: Category;
  veganOnly: boolean;
  sortBy: SortOption;
}

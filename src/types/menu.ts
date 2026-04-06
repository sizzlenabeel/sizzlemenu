export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export type Category = 'food' | 'snacks';

export type SortOption = 'price' | 'dueDate';

export type Language = 'sv' | 'en';

export type ViewMode = 'list' | 'tile';

export interface Dish {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  allergens: string;
  consumptionGuidelines: string;
  price: number;
  dueDate: Date;
  category: Category;
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

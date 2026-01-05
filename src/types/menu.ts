export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export type Category = 'food' | 'snacks';

export type SortOption = 'price' | 'dueDate';

export interface Dish {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  price: number;
  dueDate: Date;
  category: Category;
  isVegan: boolean;
  day?: DayOfWeek; // Only used for Storytel (daily rotating menu)
}

export interface MenuFilters {
  category: Category;
  veganOnly: boolean;
  sortBy: SortOption;
}

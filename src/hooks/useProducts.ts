import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dish, DayOfWeek } from '@/types/menu';
import { useLanguage } from '@/contexts/LanguageContext';

interface AllocationProductRow {
  product: ProductRow | ProductRow[] | null;
}

interface ProductRow {
  id: string;
  numeric_id: number;
  name: string | null;
  translated_name: string | null;
  description: string | null;
  translated_description: string | null;
  ingredients: string | null;
  translated_ingredients: string[] | null;
  allergens: string | null;
  translated_allergens: string | null;
  consumption_guidelines: string | null;
  translated_consumption_guidelines: string | null;
  price: number | null;
  due_date: string | null;
  is_vegan: boolean | null;
  is_snack: boolean | null;
  is_for_storytel: boolean | null;
  is_only_for_storytel: boolean | null;
  delivery_day: string | null;
  week_number: number | null;
  sizzle_deliveryday: string | null;
}

function parseIngredients(ingredients: string | null, translatedIngredients: unknown): string[] {
  if (Array.isArray(translatedIngredients) && translatedIngredients.length > 0) {
    return translatedIngredients.map(String);
  }
  if (typeof translatedIngredients === 'string' && translatedIngredients.length > 0) {
    return translatedIngredients.split(',').map(i => i.trim()).filter(Boolean);
  }
  if (ingredients) {
    return ingredients.split(',').map(i => i.trim()).filter(Boolean);
  }
  return [];
}

function parseDayOfWeek(day: string | null): DayOfWeek | undefined {
  if (!day) return undefined;
  const normalized = day.toLowerCase().trim();
  const validDays: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  return validDays.includes(normalized as DayOfWeek) ? (normalized as DayOfWeek) : undefined;
}

function extractProduct(row: AllocationProductRow): ProductRow | null {
  if (!row.product) return null;
  return Array.isArray(row.product) ? row.product[0] ?? null : row.product;
}

function dedupeProducts(products: ProductRow[]) {
  return Array.from(new Map(products.map((product) => [product.id, product])).values());
}

async function fetchAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      numeric_id,
      name,
      translated_name,
      description,
      translated_description,
      ingredients,
      translated_ingredients,
      allergens,
      translated_allergens,
      consumption_guidelines,
      translated_consumption_guidelines,
      price,
      due_date,
      is_vegan,
      is_snack,
      is_for_storytel,
      is_only_for_storytel,
      delivery_day,
      week_number,
      sizzle_deliveryday
    `);

  if (error) throw error;

  return (data || []) as ProductRow[];
}

export function useProducts(locationId?: string) {
  const { language } = useLanguage();

  return useQuery({
    queryKey: ['products', locationId, language],
    enabled: Boolean(locationId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('allocations')
        .select(`
          product:products(
            id,
            numeric_id,
            name,
            translated_name,
            description,
            translated_description,
            ingredients,
            translated_ingredients,
            allergens,
            translated_allergens,
            consumption_guidelines,
            translated_consumption_guidelines,
            price,
            due_date,
            is_vegan,
            is_snack,
            is_for_storytel,
            is_only_for_storytel,
            delivery_day,
            week_number,
            sizzle_deliveryday
          )
        `)
        .eq("location_id", locationId);

      if (error) throw error;

      const allocatedProducts = dedupeProducts(
        (data || [])
          .map(extractProduct)
          .filter((row): row is ProductRow => row !== null)
      );

      const products = allocatedProducts.length > 0
        ? allocatedProducts
        : await fetchAllProducts();

      const dishes: (Dish & { isForStorytel: boolean; isOnlyForStorytel: boolean })[] = products.map((row) => {
        const isEnglish = language === 'en';

        return {
          id: row.id,
          numericId: row.numeric_id,
          name: (isEnglish ? row.translated_name : row.name) || row.name || 'Unknown',
          description: (isEnglish ? row.translated_description : row.description) || row.description || '',
          ingredients: isEnglish
            ? parseIngredients(row.ingredients, row.translated_ingredients)
            : parseIngredients(row.ingredients, null),
          allergens: (isEnglish ? row.translated_allergens : row.allergens) || row.allergens || '',
          consumptionGuidelines: (isEnglish ? row.translated_consumption_guidelines : row.consumption_guidelines) || row.consumption_guidelines || '',
          price: row.price || 0,
          dueDate: row.due_date ? new Date(row.due_date) : new Date(),
          category: row.is_snack ? 'snacks' : 'food',
          isVegan: row.is_vegan || false,
          day: parseDayOfWeek(row.delivery_day),
          isForStorytel: row.is_for_storytel || false,
          isOnlyForStorytel: row.is_only_for_storytel || false,
          weekNumber: row.week_number ?? undefined,
          sizzleDeliveryDay: parseDayOfWeek(row.sizzle_deliveryday),
        };
      });

      return dishes;
    },
  });
}

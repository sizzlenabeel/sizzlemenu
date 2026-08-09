import { useQuery } from "@tanstack/react-query";
import { addWeeks, getISODay, getISOWeek } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { SizzlePattern } from "@/components/home/SizzlePattern";
import { WeeklyMenuCard } from "@/components/home/WeeklyMenuCard";

const copy = {
  en: {
    eyebrow: "The menu",
    currentTitle: "This week's menu",
    nextTitle: "Next week's menu",
    intro: "A preview of this week's food, available across our Sizzle fridges.",
    loading: "Loading this week's food…",
    empty: "This week's food will be added soon.",
    vegan: "Vegan",
    fallbackName: "Weekly dish",
  },
  sv: {
    eyebrow: "Menyn",
    currentTitle: "Veckans meny",
    nextTitle: "Nästa veckas meny",
    intro: "En förhandsvisning av veckans mat i våra Sizzle-kylskåp.",
    loading: "Laddar veckans mat…",
    empty: "Veckans mat kommer snart.",
    vegan: "Vegansk",
    fallbackName: "Veckans rätt",
  },
};

function useWeeklyFood(showNextWeek: boolean) {
  const today = new Date();
  const menuDate = showNextWeek ? addWeeks(today, 1) : today;
  const displayedWeek = getISOWeek(menuDate);

  return useQuery({
    queryKey: ["homepage-weekly-food", displayedWeek],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, image_url, name, translated_name, is_vegan, types, is_snack, week_number")
        .eq("week_number", displayedWeek);

      if (error) throw error;

      return (data ?? []).filter(
        (product) =>
          product.types?.includes("FOOD") ||
          (!product.types?.length && product.is_snack !== true),
      );
    },
  });
}

export function WeeklyMenu() {
  const { language } = useLanguage();
  const text = copy[language];
  const showNextWeek = getISODay(new Date()) >= 6;
  const { data: weeklyFood = [], isLoading } = useWeeklyFood(showNextWeek);

  return (
    <section className="relative overflow-hidden bg-[#10458d] px-5 py-20 text-white md:px-10 md:py-24">
      <SizzlePattern />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#f47221]">
            {text.eyebrow}
          </p>
          <h2 className="text-balance text-3xl font-black tracking-tight md:text-5xl">
            {showNextWeek ? text.nextTitle : text.currentTitle}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/70">{text.intro}</p>
        </div>

        {isLoading ? (
          <p className="text-center text-white/70">{text.loading}</p>
        ) : weeklyFood.length === 0 ? (
          <p className="mx-auto max-w-2xl rounded-2xl bg-white/10 px-5 py-8 text-center text-white/70 backdrop-blur-sm">
            {text.empty}
          </p>
        ) : (
          <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 md:gap-4">
            {weeklyFood.map((food) => {
              const foodName =
                (language === "en" ? food.translated_name : food.name) ||
                food.name ||
                text.fallbackName;

              return (
                <WeeklyMenuCard
                  key={food.id}
                  imageUrl={food.image_url}
                  name={foodName}
                  isVegan={food.is_vegan}
                  veganLabel={text.vegan}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

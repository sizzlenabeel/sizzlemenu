import { FormEvent, useState } from "react";
import { ArrowRight, MapPin, Search, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LanguageToggle } from "@/components/menu/LanguageToggle";
import { WeeklyMenu } from "@/components/home/WeeklyMenu";
import { ChefsSection } from "@/components/home/ChefsSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import sizzleLogo from "@/assets/sizzle-logo.png";

const copy = {
  en: {
    navLabel: "Sizzle home",
    eyebrow: "Good food. Great people.",
    titleStart: "A world of flavour,",
    titleAccent: "right at work.",
    intro:
      "Our chefs cook flavourful food from around the world – delivered to your office.",
    searchLabel: "Find your Sizzle fridge",
    searchPlaceholder: "Find your office and view its menu",
    searchButton: "Find menu",
    searching: "Finding…",
    notFound:
      "We couldn't find an exact match. Check your entry and try again.",
    searchError: "Something went wrong. Please try again.",
  },
  sv: {
    navLabel: "Sizzles startsida",
    eyebrow: "God mat. Fantastiska människor.",
    titleStart: "En värld av smaker,",
    titleAccent: "direkt på jobbet.",
    intro:
      "Våra kockar lagar smakrik mat från hela världen – direkt till din arbetsplats",
    searchLabel: "Hitta ditt Sizzle-kylskåp",
    searchPlaceholder: "Sök efter ditt kontor för att se utbud",
    searchButton: "Hitta meny",
    searching: "Söker…",
    notFound:
      "Vi hittade ingen exakt matchning. Kontrollera uppgifterna och försök igen.",
    searchError: "Något gick fel. Försök igen.",
  },
};

const normalize = (value: string) => value.trim().toLocaleLowerCase();

const Home = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const text = copy[language];
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const findLocation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requestedLocation = normalize(query);
    if (!requestedLocation) return;

    setError("");
    setIsSearching(true);

    const { data, error: locationError } = await supabase
      .from("locations")
      .select("name, address, dynamo_id")
      .eq("is_active", true);

    setIsSearching(false);

    if (locationError) {
      setError(text.searchError);
      return;
    }

    const location = data.find(({ name, address, dynamo_id }) =>
      [name, address, dynamo_id].some(
        (value) => value && normalize(value) === requestedLocation,
      ),
    );

    if (!location?.dynamo_id) {
      setError(text.notFound);
      return;
    }

    navigate(`/${encodeURIComponent(location.dynamo_id)}`);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#fffaf4] text-[#201d19]">
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10 md:py-7">
        <a
          href="/"
          aria-label={text.navLabel}
          className="flex items-center gap-2 text-xl font-black tracking-tight"
        >
          <img src={sizzleLogo} alt="" className="h-10 w-10 object-contain" />
          Sizzle
        </a>
        <LanguageToggle />
      </header>

      <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-10 md:px-10 md:pb-28 md:pt-20">
        <div
          aria-hidden="true"
          className="absolute -right-40 -top-32 h-[32rem] w-[32rem] rounded-full bg-[#f47221]/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-emerald-100/60 blur-3xl"
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#f47221]/25 bg-white/80 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
            <Sparkles className="h-4 w-4" /> {text.eyebrow}
          </p>
          <h1 className="text-balance text-5xl font-black leading-[1.02] tracking-[-0.045em] md:text-7xl lg:text-8xl">
            {text.titleStart}
            <br />
            <span className="text-primary">{text.titleAccent}</span>
          </h1>
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-relaxed text-[#6f675e] md:text-xl">
            {text.intro}
          </p>

          <form
            onSubmit={findLocation}
            className="mx-auto mt-10 max-w-2xl text-left"
            noValidate
          >
            <label
              htmlFor="location-search"
              className="mb-2 block pl-1 text-sm font-bold"
            >
              {text.searchLabel}
            </label>
            <div className="flex flex-col gap-3 rounded-2xl bg-white p-2 shadow-[0_18px_55px_-22px_rgba(73,45,25,0.35)] ring-1 ring-black/5 sm:flex-row">
              <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                <input
                  id="location-search"
                  name="location-search"
                  type="text"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setError("");
                  }}
                  placeholder={text.searchPlaceholder}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  className="h-12 w-full bg-transparent text-base outline-none placeholder:text-[#a49b91]"
                />
              </div>
              <button
                type="submit"
                disabled={!query.trim() || isSearching}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSearching ? (
                  <Search className="h-4 w-4 animate-pulse" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                {isSearching ? text.searching : text.searchButton}
              </button>
            </div>
            <p
              aria-live="polite"
              className="min-h-6 px-1 pt-2 text-sm font-medium text-red-600"
            >
              {error}
            </p>
          </form>
        </div>
      </section>

      <WeeklyMenu />

      <ChefsSection />
    </main>
  );
};

export default Home;

import cherryImg from "@/assets/chefs/cherry.png";
import kristianSimonImg from "@/assets/chefs/kristian-simon.png";
import elleImg from "@/assets/chefs/elle.png";
import ivetImg from "@/assets/chefs/ivet.png";
import adamImg from "@/assets/chefs/adam.jpeg";
import chinyereImg from "@/assets/chefs/chinyere.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChefCard } from "@/components/home/ChefCard";

const chefs = [
  { name: "Chef Cherry", origin: "Jamaica", flags: "🇯🇲", image: cherryImg },
  {
    name: "Chef Kristian & Simon",
    origin: "Sweden & East Asia",
    flags: "🇸🇪 🌏",
    image: kristianSimonImg,
  },
  { name: "Chef Elle", origin: "Philippines", flags: "🇵🇭", image: elleImg },
  {
    name: "Chef Ivet",
    origin: "Spain & Turkey",
    flags: "🇪🇸 🇹🇷",
    image: ivetImg,
  },
  { name: "Chef Adam", origin: "Morocco", flags: "🇲🇦", image: adamImg },
  { name: "Chef Chinyere", origin: "Nigeria", flags: "🇳🇬", image: chinyereImg },
];

const copy = {
  en: {
    eyebrow: "Made by people, not factories",
    title: "Meet some of the chefs behind the food",
    intro:
      "Independent cooks, cherished recipes and food with a story worth sharing.",
    origin: "Flavours from",
  },
  sv: {
    eyebrow: "Lagat av människor, inte fabriker",
    title: "Möt några av kockarna bakom maten",
    intro:
      "Självständiga kockar, älskade recept och mat med en historia värd att dela.",
    origin: "Smaker från",
  },
};

export function ChefsSection() {
  const { language } = useLanguage();
  const text = copy[language];

  return (
    <section className="bg-[#fffaf4] px-5 py-20 text-[#201d19] md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl md:mb-16">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#f47221]">
            {text.eyebrow}
          </p>
          <h2 className="text-balance text-3xl font-black tracking-tight md:text-5xl">
            {text.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[#6f675e]">
            {text.intro}
          </p>
        </div>

        <div className="mx-auto grid max-w-[940px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {chefs.map((chef) => (
            <ChefCard key={chef.name} {...chef} originLabel={text.origin} />
          ))}
        </div>
      </div>
    </section>
  );
}

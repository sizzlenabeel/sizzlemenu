import cherryImg from "@/assets/chefs/cherry.png";
import kristianSimonImg from "@/assets/chefs/kristian-simon.png";
import elleImg from "@/assets/chefs/elle.png";
import ivetImg from "@/assets/chefs/ivet.png";
import adamImg from "@/assets/chefs/adam.jpeg";
import chinyereImg from "@/assets/chefs/chinyere.png";

const chefs = [
  { name: "Chef Cherry", origin: "Jamaica", image: cherryImg },
  { name: "Chef Kristian & Simon", origin: "Sweden & East Asia", image: kristianSimonImg },
  { name: "Chef Elle", origin: "Philippines", image: elleImg },
  { name: "Chef Ivet", origin: "Spain & Turkey", image: ivetImg },
  { name: "Chef Adam", origin: "Morocco", image: adamImg },
  { name: "Chef Chinyere", origin: "Nigeria", image: chinyereImg },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-16 md:py-24 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Welcome to <span className="text-primary">Sizzle</span>!
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          We connect people through food, partnering with local chefs and family-run kitchens to make workplace dining more personal and meaningful. Scan the QR code on your fridge to see and buy what you have in your Sizzle fridge.
        </p>
      </section>

      {/* Chefs */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-10">
          Meet Our Chefs
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {chefs.map((chef) => (
            <div key={chef.name} className="flex flex-col items-center text-center gap-3">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-primary/20">
                <img
                  src={chef.image}
                  alt={chef.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-foreground text-base md:text-lg">{chef.name}</h3>
              <p className="text-sm text-muted-foreground">{chef.origin}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

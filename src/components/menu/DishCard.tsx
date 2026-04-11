import { useState } from "react";
import { Dish, ViewMode } from "@/types/menu";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Leaf, Calendar, ShoppingCart, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";

interface DishCardProps {
  dish: Dish;
  showPrice?: boolean;
  showBuyButton?: boolean;
  locationName?: string;
  viewMode?: ViewMode;
  upcoming?: boolean;
}

export function DishCard({ dish, showPrice = true, showBuyButton = false, locationName, viewMode = 'list', upcoming = false }: DishCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const isSwedish = language === 'sv';

  const bestBeforeLabel = isSwedish ? 'Bäst före' : 'Best before';
  const buyLabel = isSwedish ? 'KÖP NU' : 'BUY NOW';
  const addToCartLabel = isSwedish ? 'LÄGG I VARUKORG' : 'ADD TO CART';
  const upcomingLabel = isSwedish ? 'Kommande' : 'Upcoming';
  const formattedDate = format(dish.dueDate, 'd MMM', { locale: isSwedish ? sv : undefined });

  const swishUrl = showBuyButton && locationName && !upcoming
    ? (() => {
        const msg = `${locationName}-${dish.name}`.replace(/\s+/g, '').substring(0, 50);
        return `https://app.swish.nu/1/p/sw/?sw=1234355145&amt=${dish.price}&cur=SEK&msg=${msg}&edit=amt,msg&src=qr`;
      })()
    : null;

  const badges = (
    <div className="flex flex-wrap items-center gap-2">
      {dish.isVegan && (
        <Badge variant="secondary" className="bg-vegan/10 text-vegan border-vegan/20">
          <Leaf className="h-3 w-3 mr-1" />
          Vegan
        </Badge>
      )}
      {upcoming && (
        <Badge variant="outline" className="text-xs">{upcomingLabel}</Badge>
      )}
    </div>
  );

  if (viewMode === 'tile') {
    return (
      <Card className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-lg animate-fade-in flex flex-col",
        upcoming && "opacity-50"
      )}>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <div className="cursor-pointer select-none flex flex-col h-full">
              {/* Image with price overlay */}
              <div className="relative aspect-[4/3] bg-muted flex items-center justify-center">
                {dish.imageUrl ? (
                  <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
                )}
                {/* Badges top-left */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  {dish.isVegan && (
                    <Badge variant="secondary" className="bg-vegan/10 text-vegan border-vegan/20 text-xs backdrop-blur-sm">
                      <Leaf className="h-3 w-3 mr-0.5" />
                      Vegan
                    </Badge>
                  )}
                  {upcoming && (
                    <Badge variant="outline" className="text-xs bg-background/80 backdrop-blur-sm">{upcomingLabel}</Badge>
                  )}
                </div>
                {/* Price badge top-right */}
                {showPrice && (
                  <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-full shadow-md">
                    {dish.price} kr
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-grow gap-3">
                <h3 className="font-bold text-lg leading-tight">{dish.name}</h3>

                {dish.allergens && (
                  <span className="text-xs text-muted-foreground italic">⚠ {dish.allergens}</span>
                )}

                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {bestBeforeLabel}: {formattedDate}
                </div>

                {/* Buttons */}
                {!upcoming && (showBuyButton || swishUrl) && (
                  <div className="flex items-stretch gap-2 mt-auto pt-3">
                    {showBuyButton && (
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(dish); }}
                        className="inline-flex items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors w-10 h-10 shrink-0"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    )}
                    {swishUrl && (
                      <a
                        href={swishUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 min-w-0 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-bold uppercase px-3 py-2.5 hover:from-primary/90 hover:to-primary/70 transition-colors text-center whitespace-normal"
                      >
                        {buyLabel}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 pb-4 px-4 border-t bg-secondary/30">
              <DishDetails dish={dish} isSwedish={isSwedish} />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  }

  // List view
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 hover:shadow-lg animate-fade-in",
      upcoming && "opacity-50"
    )}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="cursor-pointer select-none p-5 hover:bg-secondary/50 transition-colors">
            <div className="flex flex-col gap-3">
              {/* Badges */}
              {badges}

              {/* Name */}
              <h3 className="font-bold text-xl leading-tight">{dish.name}</h3>

              {/* Best before + Allergens side by side */}
              <div className="flex flex-wrap items-start gap-x-6 gap-y-1">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{bestBeforeLabel}</span>
                  <span className="text-sm font-semibold flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {formattedDate}
                  </span>
                </div>
                {dish.allergens && (
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {isSwedish ? 'Allergener' : 'Allergens'}
                    </span>
                    <span className="text-sm text-muted-foreground">{dish.allergens}</span>
                  </div>
                )}
              </div>

              {/* Price */}
              {showPrice && (
                <p className="text-2xl font-bold text-primary">{dish.price} kr</p>
              )}

              {/* Buttons */}
              {!upcoming && (showBuyButton || swishUrl) && (
                <div className="flex items-center justify-between gap-3 pt-1">
                  {showBuyButton && (
                    <button
                      onClick={(e) => { e.stopPropagation(); addToCart(dish); }}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {isSwedish ? 'Lägg i varukorg' : 'Add to Cart'}
                    </button>
                  )}
                  {swishUrl && (
                    <a
                      href={swishUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold uppercase px-6 py-2.5 hover:bg-primary/90 transition-colors"
                    >
                      {buyLabel}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4 px-5 border-t bg-secondary/30">
            <DishDetails dish={dish} isSwedish={isSwedish} />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

function DishDetails({ dish, isSwedish }: { dish: Dish; isSwedish: boolean }) {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-4 mt-4">{dish.description}</p>
      {dish.ingredients.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            {isSwedish ? 'Ingredienser' : 'Ingredients'}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {dish.ingredients.map((ingredient, index) => (
              <Badge key={index} variant="outline" className="text-xs font-normal">{ingredient}</Badge>
            ))}
          </div>
        </div>
      )}
      {dish.allergens && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            {isSwedish ? 'Allergener' : 'Allergens'}
          </h4>
          <p className="text-sm text-muted-foreground">{dish.allergens}</p>
        </div>
      )}
      {dish.consumptionGuidelines && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            {isSwedish ? 'Serveringsinstruktioner' : 'Serving Instructions'}
          </h4>
          <p className="text-sm text-muted-foreground">{dish.consumptionGuidelines}</p>
        </div>
      )}
    </>
  );
}

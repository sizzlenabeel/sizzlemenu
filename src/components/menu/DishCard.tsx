import { useState } from "react";
import { Dish, ViewMode } from "@/types/menu";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Leaf, Calendar, ShoppingCart, ImageIcon } from "lucide-react";
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
  const buyLabel = isSwedish ? 'Köp nu' : 'Buy now';
  const addToCartLabel = isSwedish ? 'Lägg i varukorg' : 'Add to cart';
  const upcomingLabel = isSwedish ? 'Kommande' : 'Upcoming';
  const formattedDate = format(dish.dueDate, 'd MMM', { locale: isSwedish ? sv : undefined });

  const swishUrl = showBuyButton && locationName && !upcoming
    ? (() => {
        const msg = `${locationName}-${dish.name}`.replace(/\s+/g, '').substring(0, 50);
        return `https://app.swish.nu/1/p/sw/?sw=1234355145&amt=${dish.price}&cur=SEK&msg=${msg}&edit=amt,msg&src=qr`;
      })()
    : null;

  if (viewMode === 'tile') {
    return (
      <Card className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-lg animate-fade-in flex flex-col",
        upcoming && "opacity-50"
      )}>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <div className="cursor-pointer select-none flex flex-col h-full">
              {/* Image */}
              <div className="aspect-square bg-muted flex items-center justify-center">
                {dish.imageUrl ? (
                  <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
                )}
              </div>

              <div className="p-3 flex flex-col flex-grow space-y-2">
                {/* Name */}
                <h3 className="font-bold text-sm leading-tight min-h-[2.5rem]">{dish.name}</h3>

                {/* Badges row */}
                <div className="min-h-[24px] flex items-center gap-1 flex-wrap">
                  {dish.isVegan && (
                    <Badge variant="secondary" className="bg-vegan/10 text-vegan border-vegan/20 text-xs">
                      <Leaf className="h-3 w-3 mr-0.5" />
                      Vegan
                    </Badge>
                  )}
                  {upcoming && (
                    <Badge variant="outline" className="text-xs">{upcomingLabel}</Badge>
                  )}
                  {dish.allergens && (
                    <span className="text-xs text-muted-foreground italic">⚠ {dish.allergens}</span>
                  )}
                </div>

                {/* Price */}
                {showPrice && (
                  <p className="text-base font-bold text-primary">{dish.price} kr</p>
                )}

                {/* Best before */}
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {bestBeforeLabel}: {formattedDate}
                </div>

                {/* Actions - pushed to bottom */}
                {!upcoming && (showBuyButton || swishUrl) && (
                  <div className="flex items-center gap-2 pt-1 mt-auto">
                    {showBuyButton && (
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(dish); }}
                        className="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground text-xs font-medium px-3 py-2 hover:bg-secondary/80 transition-colors"
                        title={addToCartLabel}
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
                        className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-medium px-4 py-2 hover:bg-primary/90 transition-colors flex-1 text-center"
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
            <CardContent className="pt-0 pb-4 px-3 border-t bg-secondary/30">
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
          <CardHeader className="cursor-pointer select-none p-4 hover:bg-secondary/50 transition-colors">
            <div className="flex flex-col gap-3">
              {/* Row 1: Name + Chevron */}
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-bold text-lg leading-tight">{dish.name}</h3>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform duration-200 shrink-0 mt-1",
                    isOpen && "rotate-180"
                  )}
                />
              </div>

              {/* Row 2: Badges + Allergens */}
              <div className="min-h-[28px] flex flex-wrap items-center gap-2">
                {dish.isVegan && (
                  <Badge variant="secondary" className="bg-vegan/10 text-vegan border-vegan/20 shrink-0">
                    <Leaf className="h-3 w-3 mr-1" />
                    Vegan
                  </Badge>
                )}
                {upcoming && (
                  <Badge variant="outline" className="text-xs">{upcomingLabel}</Badge>
                )}
                {dish.allergens && (
                  <span className="text-xs text-muted-foreground italic">⚠ {dish.allergens}</span>
                )}
              </div>

              {/* Row 3: Price + Date | Actions */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {showPrice && (
                    <span className="text-base font-bold text-primary">{dish.price} kr</span>
                  )}
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {bestBeforeLabel}: {formattedDate}
                  </span>
                </div>

                {!upcoming && (showBuyButton || swishUrl) && (
                  <div className="flex items-center gap-2 shrink-0">
                    {showBuyButton && (
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(dish); }}
                        className="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground text-xs font-medium px-3 py-2 hover:bg-secondary/80 transition-colors"
                        title={addToCartLabel}
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
                        className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-medium px-4 py-2 hover:bg-primary/90 transition-colors"
                      >
                        {buyLabel}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
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

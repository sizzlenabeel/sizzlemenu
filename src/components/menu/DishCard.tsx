import { useState } from "react";
import { Dish } from "@/types/menu";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Leaf, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";

interface DishCardProps {
  dish: Dish;
  showPrice?: boolean;
  showBuyButton?: boolean;
  locationName?: string;
}

export function DishCard({ dish, showPrice = true, showBuyButton = false, locationName }: DishCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const isSwedish = language === 'sv';

  const bestBeforeLabel = isSwedish ? 'Bäst före' : 'Best before';
  const buyLabel = isSwedish ? 'Köp nu' : 'Buy now';
  const formattedDate = format(dish.dueDate, 'd MMM', { locale: isSwedish ? sv : undefined });

  const swishUrl = showBuyButton && locationName
    ? (() => {
        const msg = `${locationName}_${dish.name}`.replace(/\s+/g, '').substring(0, 50);
        return `https://app.swish.nu/1/p/sw/?sw=1234355145&amt=${dish.price}&cur=SEK&msg=${msg}&edit=amt,msg&src=qr`;
      })()
    : null;

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg animate-fade-in">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer select-none p-4 hover:bg-secondary/50 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg truncate">{dish.name}</h3>
                  {dish.isVegan && (
                    <Badge variant="secondary" className="bg-vegan/10 text-vegan border-vegan/20 shrink-0">
                      <Leaf className="h-3 w-3 mr-1" />
                      Vegan
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {showPrice && (
                    <span className="font-semibold text-foreground">
                      {dish.price} kr
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {bestBeforeLabel}: {formattedDate}
                  </span>
                  {dish.allergens && (
                    <span className="text-xs text-muted-foreground italic">
                      ⚠ {dish.allergens}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {swishUrl && (
                  <a
                    href={swishUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 hover:bg-primary/90 transition-colors"
                  >
                    {buyLabel}
                  </a>
                )}
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform duration-200 shrink-0",
                    isOpen && "rotate-180"
                  )}
                />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4 px-4 border-t bg-secondary/30">
            <p className="text-sm text-muted-foreground mb-4 mt-4">
              {dish.description}
            </p>
            
            {dish.ingredients.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Ingredients
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {dish.ingredients.map((ingredient, index) => (
                    <Badge key={index} variant="outline" className="text-xs font-normal">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {dish.allergens && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Allergens
                </h4>
                <p className="text-sm text-muted-foreground">{dish.allergens}</p>
              </div>
            )}

            {dish.consumptionGuidelines && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Serving Instructions
                </h4>
                <p className="text-sm text-muted-foreground">{dish.consumptionGuidelines}</p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

import { useState } from "react";
import { Dish } from "@/types/menu";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Leaf, Calendar, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DishCardProps {
  dish: Dish;
}

export function DishCard({ dish }: DishCardProps) {
  const [isOpen, setIsOpen] = useState(false);

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
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <DollarSign className="h-4 w-4" />
                    {dish.price.toFixed(2)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(dish.dueDate, 'MMM d')}
                  </span>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform duration-200 shrink-0",
                  isOpen && "rotate-180"
                )}
              />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4 px-4 border-t bg-secondary/30">
            <p className="text-sm text-muted-foreground mb-4 mt-4">
              {dish.description}
            </p>
            <div>
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
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

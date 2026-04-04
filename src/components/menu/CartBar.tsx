import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, Minus, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CartBarProps {
  locationName: string;
}

function buildSwishUrl(locationName: string, items: { dish: { name: string; price: number }; quantity: number }[]) {
  const total = items.reduce((sum, i) => sum + i.dish.price * i.quantity, 0);
  const firstWords = items.map((i) => i.dish.name.split(/\s+/)[0]).join("");
  const msg = `${locationName}-${firstWords}`.replace(/\s+/g, "").substring(0, 50);
  return `https://app.swish.nu/1/p/sw/?sw=1234355145&amt=${total}&cur=SEK&msg=${msg}&edit=amt,msg&src=qr`;
}

export function CartBar({ locationName }: CartBarProps) {
  const { items, removeFromCart, addToCart, clearCart, getCartTotal, getItemCount } = useCart();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const isSwedish = language === "sv";

  if (items.length === 0) return null;

  const swishUrl = buildSwishUrl(locationName, items);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <div className="container max-w-4xl px-4 py-3 space-y-2 max-h-60 overflow-y-auto">
            {items.map((item) => (
              <div key={item.dish.id} className="flex items-center justify-between text-sm">
                <span className="truncate flex-1">{item.dish.name}</span>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFromCart(item.dish.id)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-5 text-center">{item.quantity}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => addToCart(item.dish)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                  <span className="w-16 text-right font-medium">{item.dish.price * item.quantity} kr</span>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>

        <div className="container max-w-4xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <ShoppingCart className="h-4 w-4" />
                <span>{getItemCount()} {isSwedish ? "st" : "items"}</span>
              </Button>
            </CollapsibleTrigger>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clearCart}>
                <X className="h-4 w-4 mr-1" />
                {isSwedish ? "Rensa" : "Clear"}
              </Button>
              <span className="font-bold">{getCartTotal()} kr</span>
              <a
                href={swishUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium px-4 py-2 hover:bg-primary/90 transition-colors"
                )}
              >
                {isSwedish ? "Betala med Swish" : "Pay with Swish"}
              </a>
            </div>
          </div>
        </div>
      </Collapsible>
    </div>
  );
}

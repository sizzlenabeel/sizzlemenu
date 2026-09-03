import { ArrowLeft, ImageIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { CartBar } from "@/components/menu/CartBar";
import { DishCard } from "@/components/menu/DishCard";
import { LanguageToggle } from "@/components/menu/LanguageToggle";
import { MessageBanner } from "@/components/menu/MessageBanner";
import { Skeleton } from "@/components/ui/skeleton";
import { useBannerMessages } from "@/hooks/useBannerMessages";
import { useLocation } from "@/hooks/useLocation";
import { useProducts } from "@/hooks/useProducts";
import { useLanguage } from "@/contexts/LanguageContext";
import NotFound from "./NotFound";

export default function ProductPage() {
  const { dynamoId, productId } = useParams();
  const { language } = useLanguage();
  const { data: location, isLoading: locationLoading, error: locationError } = useLocation(dynamoId);
  const { data: products, isLoading: productsLoading, error: productsError } = useProducts(location?.id);
  const { data: banners = [] } = useBannerMessages(location?.id);

  if (locationLoading || productsLoading) {
    return (
      <main className="min-h-screen bg-background">
        <MessageBanner banners={banners} />
        <div className="container max-w-2xl px-4 py-8"><Skeleton className="h-80 w-full" /></div>
      </main>
    );
  }

  if (locationError || productsError) {
    return (
      <main className="min-h-screen bg-background">
        <MessageBanner banners={banners} />
        <p className="container max-w-2xl px-4 py-8 text-destructive">
          {language === "sv" ? "Produkten kunde inte laddas." : "The product couldn't be loaded."}
        </p>
      </main>
    );
  }

  const product = products?.find((item) => item.id === productId);
  const isStorytel = location?.name.toLowerCase() === "storytel";
  const isAvailableAtLocation = product && (
    isStorytel
      ? product.isForStorytel || product.isOnlyForStorytel
      : !product.isOnlyForStorytel
  );
  if (!location || !dynamoId || !product || !isAvailableAtLocation) return <NotFound />;

  const backPath = `/${encodeURIComponent(dynamoId)}/${product.category}`;

  return (
    <main className="min-h-screen bg-background">
      <MessageBanner banners={banners} />
      <div className="container max-w-2xl px-4 pt-8 pb-28">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <Link to={backPath} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" />
              {language === "sv" ? `Tillbaka till ${location.name}` : `Back to ${location.name}`}
            </Link>
            <h1 className="text-3xl font-black tracking-tight">{product.name}</h1>
          </div>
          <LanguageToggle />
        </header>

        <div className="mb-6 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border bg-card">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <ImageIcon aria-hidden="true" className="h-16 w-16 text-muted-foreground/40" />
          )}
        </div>

        <DishCard dish={product} showBuyButton locationName={location.name} viewMode="list" />
      </div>
      <CartBar locationName={location.name} locationId={location.id} />
    </main>
  );
}

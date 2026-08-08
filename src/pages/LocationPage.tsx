import { useParams } from "react-router-dom";
import NotFound from "./NotFound";
import DailyMenu from "./DailyMenu";
import LocationMenu from "./LocationMenu";
import { useLocation } from "@/hooks/useLocation";
import { DayOfWeek } from "@/types/menu";
import { useLanguage } from "@/contexts/LanguageContext";

function usesDailyMenu(locationName: string) {
  return locationName.toLowerCase() === "storytel";
}

function getStorytelInitialDay(date = new Date()): DayOfWeek {
  const day = date.getDay();

  switch (day) {
    case 1:
      return "monday";
    case 2:
      return "tuesday";
    case 3:
      return "wednesday";
    case 4:
      return "thursday";
    case 5:
      return "friday";
    default:
      return "friday";
  }
}

export default function LocationPage() {
  const { dynamoId } = useParams();
  const { language } = useLanguage();
  const { data: location, isLoading, error } = useLocation(dynamoId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl py-8 px-4">
          <p className="text-muted-foreground">
            {language === "sv" ? "Laddar menyn..." : "Loading menu..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl px-4 py-8">
          <p className="text-destructive">
            {language === "sv"
              ? "Menyn kunde inte laddas. Försök igen om en stund."
              : "The menu couldn't be loaded. Please try again shortly."}
          </p>
        </div>
      </div>
    );
  }

  if (!location || !dynamoId) {
    return <NotFound />;
  }

  if (usesDailyMenu(location.name)) {
    return (
      <DailyMenu
        locationId={location.id}
        locationName={location.name}
        initialCategory="snacks"
        initialSelectedDay={getStorytelInitialDay()}
      />
    );
  }

  return <LocationMenu locationId={location.id} locationName={location.name} />;
}

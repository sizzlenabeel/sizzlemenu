import { useParams } from "react-router-dom";
import NotFound from "./NotFound";
import DailyMenu from "./DailyMenu";
import LocationMenu from "./LocationMenu";
import { useLocation } from "@/hooks/useLocation";

function usesDailyMenu(locationName: string) {
  return locationName.toLowerCase() === "storytel";
}

export default function LocationPage() {
  const { dynamoId } = useParams();
  const { data: location, isLoading, error } = useLocation(dynamoId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl py-8 px-4">
          <p className="text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error || !location || !dynamoId) {
    return <NotFound />;
  }

  if (usesDailyMenu(location.name)) {
    return <DailyMenu locationId={location.id} locationName={location.name} />;
  }

  return <LocationMenu locationId={location.id} locationName={location.name} />;
}

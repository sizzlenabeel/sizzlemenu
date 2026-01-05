import { UtensilsCrossed } from "lucide-react";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "No dishes available" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
        <UtensilsCrossed className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-lg font-medium text-muted-foreground">{message}</p>
      <p className="text-sm text-muted-foreground mt-1">
        Dishes will appear here when added
      </p>
    </div>
  );
}

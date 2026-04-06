import { LayoutGrid, List } from "lucide-react";
import { ViewMode } from "@/types/menu";
import { cn } from "@/lib/utils";

interface ViewToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center rounded-md border border-input bg-background">
      <button
        onClick={() => onChange('list')}
        className={cn(
          "inline-flex items-center justify-center p-2 rounded-l-md transition-colors",
          value === 'list' ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        )}
        aria-label="List view"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        onClick={() => onChange('tile')}
        className={cn(
          "inline-flex items-center justify-center p-2 rounded-r-md transition-colors",
          value === 'tile' ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        )}
        aria-label="Tile view"
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
    </div>
  );
}

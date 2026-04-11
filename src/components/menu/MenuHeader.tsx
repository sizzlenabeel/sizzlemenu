import { LanguageToggle } from './LanguageToggle';
import { ViewToggle } from './ViewToggle';
import { ViewMode } from '@/types/menu';

interface MenuHeaderProps {
  locationName: string;
  subtitle?: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function MenuHeader({ locationName, subtitle, viewMode, onViewModeChange }: MenuHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
            {locationName}
          </h1>
          {subtitle && (
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle value={viewMode} onChange={onViewModeChange} />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}

import { LanguageToggle } from './LanguageToggle';

interface MenuHeaderProps {
  locationName: string;
  subtitle?: string;
}

export function MenuHeader({ locationName, subtitle }: MenuHeaderProps) {
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
        <LanguageToggle />
      </div>
    </header>
  );
}

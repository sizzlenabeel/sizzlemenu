interface MenuHeaderProps {
  locationName: string;
  subtitle?: string;
}

export function MenuHeader({ locationName, subtitle }: MenuHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
        {locationName}
      </h1>
      {subtitle && (
        <p className="text-lg text-muted-foreground">{subtitle}</p>
      )}
    </header>
  );
}

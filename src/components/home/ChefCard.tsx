interface ChefCardProps {
  image: string;
  name: string;
  origin: string;
  originLabel: string;
  flags: string;
}

export function ChefCard({ image, name, origin, originLabel, flags }: ChefCardProps) {
  return (
    <article className="group w-full max-w-[300px] justify-self-center overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-black/5">
      <div className="relative aspect-[4/5] overflow-hidden bg-black/5">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <span
          className="absolute right-5 top-5 inline-flex min-h-9 items-center justify-center rounded-full bg-white/90 px-3 text-lg shadow-sm backdrop-blur-sm"
          role="img"
          aria-label={origin}
        >
          {flags}
        </span>
      </div>
      <div className="p-5 text-[#201d19]">
        <h3 className="text-xl font-black tracking-tight">{name}</h3>
        <p className="mt-1 text-sm font-medium text-[#6f675e]">
          {originLabel} {origin}
        </p>
      </div>
    </article>
  );
}

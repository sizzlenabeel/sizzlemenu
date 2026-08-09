import { ImageIcon, Leaf } from "lucide-react";

interface WeeklyMenuCardProps {
  imageUrl: string | null;
  name: string;
  isVegan: boolean | null;
  veganLabel: string;
}

export function WeeklyMenuCard({
  imageUrl,
  name,
  isVegan,
  veganLabel,
}: WeeklyMenuCardProps) {
  return (
    <article className="w-[calc(50%-0.375rem)] cursor-default overflow-hidden rounded-xl bg-white text-[#201d19] shadow-[0_12px_35px_-18px_rgba(0,0,0,0.65)] sm:w-[calc(33.333%-0.5rem)] lg:w-[calc(20%-0.8rem)]">
      <div className="relative aspect-square bg-[#f5f1eb]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            className="h-full w-full object-contain p-1"
          />
        ) : (
          <div className="flex h-full items-center justify-center" aria-hidden="true">
            <ImageIcon className="h-10 w-10 text-black/20" />
          </div>
        )}

        {isVegan && (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-1 text-[11px] font-bold text-white shadow-sm">
            <Leaf className="h-3 w-3" />
            {veganLabel}
          </span>
        )}
      </div>
      <h3 className="p-3 text-sm font-black leading-snug md:text-base">{name}</h3>
    </article>
  );
}

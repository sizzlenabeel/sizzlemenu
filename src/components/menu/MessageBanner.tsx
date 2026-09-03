import { ArrowRight, Megaphone } from "lucide-react";
import { useParams } from "react-router-dom";
import { BannerMessage } from "@/hooks/useBannerMessages";

function getSafeLink(value: string | null) {
  if (!value) return null;
  if (value.startsWith("/") && !value.startsWith("//")) return { href: value, external: false };
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol)
      ? { href: url.toString(), external: true }
      : null;
  } catch {
    return null;
  }
}

function replaceToken(value: string, token: string, replacement: string) {
  return value.split(token).join(replacement);
}

export function MessageBanner({ banners }: { banners: BannerMessage[] }) {
  const { dynamoId } = useParams();
  if (banners.length === 0) return null;

  return (
    <div className="w-full border-b border-primary/20 bg-primary text-primary-foreground shadow-sm">
      {banners.map((banner) => {
        const linkTemplate = banner.link_url || (banner.product_id
          ? "/{location}/product/{productId}"
          : null);
        const needsLocation = linkTemplate?.includes("{location}");
        const needsProduct = linkTemplate?.includes("{product}") || linkTemplate?.includes("{productId}");
        let resolvedUrl = (needsLocation && !dynamoId) || (needsProduct && !banner.product_id)
          ? null
          : linkTemplate;
        if (resolvedUrl) {
          resolvedUrl = replaceToken(resolvedUrl, "{baseurl}", window.location.origin);
          resolvedUrl = replaceToken(resolvedUrl, "{location}", encodeURIComponent(dynamoId ?? ""));
          resolvedUrl = replaceToken(resolvedUrl, "{product}", encodeURIComponent(banner.product_id ?? ""));
          resolvedUrl = replaceToken(resolvedUrl, "{productId}", encodeURIComponent(banner.product_id ?? ""));
        }
        const link = getSafeLink(resolvedUrl ?? null);
        const content = (
          <>
            <Megaphone className="h-5 w-5 shrink-0" />
            <span className="flex-1 font-semibold">{banner.message}</span>
            {link && (
              <span className="inline-flex items-center gap-1 text-sm font-bold underline underline-offset-4">
                {banner.link_label || "View deal"}<ArrowRight className="h-4 w-4" />
              </span>
            )}
          </>
        );

        return link ? (
          <a key={banner.id} href={link.href} target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
            {content}
          </a>
        ) : <div key={banner.id} className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">{content}</div>;
      })}
    </div>
  );
}

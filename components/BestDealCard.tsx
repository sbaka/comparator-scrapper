"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ExternalLink, Share2, TrendingDown } from "lucide-react";
import type { BestDealCardProps } from "@/interfaces";
import { ViewersBadge } from "./ViewersBadge";
import { getSellerColor } from "@/lib/seller-colors";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function BestDealCard({ product }: BestDealCardProps) {
  const t = useTranslations("bestDeal");
  const comparisonT = useTranslations("priceComparison");
  const productCardT = useTranslations("productCard");
  const searchT = useTranslations("search");
  const sourceRelation = Array.isArray(product.source)
    ? product.source[0]
    : product.source;
  const sourceName =
    sourceRelation?.name_source ||
    (product.id_source ? `Store ${product.id_source}` : "Unknown seller");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const sellerColor = getSellerColor(sourceName);

  return (
    <div className="relative overflow-hidden rounded-lg bg-card ring-2 ring-primary shadow-xl hover:shadow-2xl transition-shadow">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />

      {/* Lowest price banner */}
      <div className="relative z-10 flex items-center justify-between gap-3 border-b border-primary/40 bg-primary/20 px-4 py-2">
        <div className="flex items-center gap-2">
          <TrendingDown size={16} className="text-primary" />
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            {comparisonT("lowestPrice")}
          </span>
        </div>
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
          {t("badge")}
        </span>
      </div>

      {/* Content wrapper */}
      <div className="relative flex flex-col md:flex-row gap-6 p-6 md:p-8">
        {/* Image section */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto rounded-lg overflow-hidden bg-muted shrink-0">
          <Image
            src={
              product.img_product ||
              `https://picsum.photos/seed/${product.id_product}/400/300`
            }
            alt={product.name_product}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Text section */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          {/* Product Info */}
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-balance">
              {product.name_product}
            </h2>

            {/* Seller info */}
            <div className="pt-2 border-t border-border space-y-3">
              <p className="text-sm text-muted-foreground">
                {t("availableAt", { seller: sourceName })}
              </p>
              <div className="flex items-center gap-2">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full ${sellerColor.light} border ${sellerColor.border}`}
                >
                  <span className={`text-xs font-semibold ${sellerColor.text}`}>
                    {sourceName}
                  </span>
                </div>
                {!isDialogOpen && (
                  <ViewersBadge id={product.id_product} compact={true} />
                )}
              </div>
            </div>
          </div>

          {/* Price highlight */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {t("priceLabel")}
            </p>
            <div className="flex items-baseline gap-3">
              <span className="font-grotesk text-4xl md:text-5xl font-bold text-primary">
                {Number(product.price_product)} {searchT("currency")}
              </span>
            </div>
          </div>

          {/* CTA */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                {t("cta")}
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl p-0 overflow-hidden">
              <DialogHeader className="sr-only">
                <DialogTitle>{product.name_product}</DialogTitle>
                <DialogDescription>
                  {productCardT("popupDescription", { seller: sourceName })}
                </DialogDescription>
              </DialogHeader>

              <div className="relative h-64 w-full overflow-hidden bg-muted">
                <Image
                  src={
                    product.img_product ||
                    `https://picsum.photos/seed/${product.id_product}/400/300`
                  }
                  alt={product.name_product}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="absolute top-4 right-4 z-10 p-2 bg-black/40 hover:bg-black/60 rounded-full transition-colors text-white"
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M15 5L5 15M5 5L15 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                <div className="absolute bottom-4 left-4 px-4 py-2 bg-primary rounded-full">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {t("badge")}
                  </span>
                </div>
              </div>

              <div className="px-6 py-6 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground text-balance">
                    {product.name_product}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {productCardT("popupDescription", { seller: sourceName })}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted/50 p-4 border border-border">
                    <p className="text-xs text-muted-foreground font-semibold uppercase mb-2">
                      {productCardT("price")}
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {Number(product.price_product)}{" "}
                      <span className="text-sm">{searchT("currency")}</span>
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-4 border border-border">
                    <p className="text-xs text-muted-foreground font-semibold uppercase mb-2">
                      {productCardT("retailer")}
                    </p>
                    <p
                      className={`font-semibold text-foreground ${sellerColor.text}`}
                    >
                      {sourceName}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 rounded-lg bg-muted/50 p-4 border border-border text-center">
                    <ViewersBadge id={product.id_product} shouldTrack={true} />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <a
                    href={product.link_product}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg"
                  >
                    <ExternalLink size={16} />
                    {productCardT("viewOffer")}
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      navigator
                        .share?.({
                          title: product.name_product,
                          text: `Check out this deal: ${product.name_product} for ${Number(product.price_product)} ${searchT("currency")}`,
                          url: product.link_product,
                        })
                        .catch(() => {
                          navigator.clipboard.writeText(product.link_product);
                        });
                    }}
                    className="px-4 py-3 rounded-lg bg-muted text-foreground border border-border hover:bg-primary/10 transition-colors"
                    aria-label="Share"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Stock status */}
          <p className="text-xs text-primary font-semibold">
            ✓ {t("inStockLimited")}
          </p>
        </div>
      </div>
    </div>
  );
}

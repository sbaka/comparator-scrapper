"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ProductCardProps } from "@/interfaces";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ViewersBadge } from "./ViewersBadge";
import { getSellerColor } from "@/lib/seller-colors";
import { Share2, ExternalLink } from "lucide-react";
import { useState } from "react";

export function ProductCard({ product, isBestDeal = false }: ProductCardProps) {
  const t = useTranslations("productCard");
  const bestDealT = useTranslations("bestDeal");
  const searchT = useTranslations("search");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sourceRelation = Array.isArray(product.source)
    ? product.source[0]
    : product.source;
  const sourceName =
    sourceRelation?.name_source ||
    (product.id_source ? `Store ${product.id_source}` : "Unknown seller");

  const sellerColor = getSellerColor(sourceName);

  return (
    <div
      className={`group relative overflow-hidden rounded-lg transition-all duration-300 subtle-scale border ${
        isBestDeal
          ? "bg-card ring-2 ring-primary shadow-lg border-primary"
          : "bg-card border-border hover:shadow-md hover:border-primary/50"
      }`}
    >
      {/* Top Badge Area */}
      {isBestDeal && (
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-linear-to-r from-primary to-transparent">
          <span className="text-xs font-semibold text-white uppercase tracking-wider">
            {bestDealT("badge")}
          </span>
        </div>
      )}

      {/* Product Image */}
      <div
        className={`relative w-full overflow-hidden bg-muted ${isBestDeal ? "h-48" : "h-32"}`}
      >
        <Image
          src={
            product.img_product ||
            `https://picsum.photos/seed/${product.id_product}/400/300`
          }
          alt={product.name_product}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes={
            isBestDeal
              ? "(max-width: 768px) 100vw, 400px"
              : "(max-width: 768px) 100vw, 300px"
          }
        />
      </div>

      {/* Content */}
      <div className={`relative ${isBestDeal ? "px-6 py-4" : "p-4"} space-y-3`}>
        {/* Product Name */}
        <h3 className="text-sm font-semibold text-foreground line-clamp-2">
          {product.name_product}
        </h3>

        {/* Seller Badge & Viewers */}
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

        {/* Price Section */}
        <div
          className={`flex items-baseline gap-2 ${isBestDeal ? "pt-2 border-t border-border" : "pt-1"}`}
        >
          <span
            className={`font-grotesk font-bold ${
              isBestDeal ? "text-primary text-2xl" : "text-foreground text-xl"
            }`}
          >
            {Number(product.price_product)} {searchT("currency")}
          </span>
        </div>

        {/* CTA Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className={`w-full mt-3 px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm ${
                isBestDeal
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-muted text-foreground hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              {t("viewOffer")}
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl p-0 overflow-hidden">
            <DialogHeader className="sr-only">
              <DialogTitle>{product.name_product}</DialogTitle>
              <DialogDescription>
                {t("popupDescription", { seller: sourceName })}
              </DialogDescription>
            </DialogHeader>

            {/* Header Image Section */}
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
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

              {/* Close button */}
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

              {/* Badge overlay */}
              {isBestDeal && (
                <div className="absolute bottom-4 left-4 px-4 py-2 bg-primary rounded-full">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {bestDealT("badge")}
                  </span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="px-6 py-6 space-y-6">
              {/* Title and Description */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground text-balance">
                  {product.name_product}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("popupDescription", { seller: sourceName })}
                </p>
              </div>

              {/* Price & Seller Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted/50 p-4 border border-border">
                  <p className="text-xs text-muted-foreground font-semibold uppercase mb-2">
                    {t("price")}
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {Number(product.price_product)}{" "}
                    <span className="text-sm">{searchT("currency")}</span>
                  </p>
                </div>

                <div className="rounded-lg bg-muted/50 p-4 border border-border">
                  <p className="text-xs text-muted-foreground font-semibold uppercase mb-2">
                    {t("retailer")}
                  </p>
                  <p
                    className={`font-semibold text-foreground ${sellerColor.text}`}
                  >
                    {sourceName}
                  </p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex gap-4">
                <div className="flex-1 rounded-lg bg-muted/50 p-4 border border-border text-center">
                  <ViewersBadge id={product.id_product} shouldTrack={true} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <a
                  href={product.link_product}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg"
                >
                  <ExternalLink size={16} />
                  {t("viewOffer")}
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
      </div>
    </div>
  );
}

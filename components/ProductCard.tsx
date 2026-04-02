"use client";

import { useState } from "react";
import { Product } from "@/lib/data";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProductCardProps {
  product: Product;
  isBestDeal?: boolean;
}

export function ProductCard({ product, isBestDeal = false }: ProductCardProps) {
  const t = useTranslations("productCard");
  const bestDealT = useTranslations("bestDeal");
  const [isOpen, setIsOpen] = useState(false);
  const [popupViewCount, setPopupViewCount] = useState(0);

  const handleOpenChange = (open: boolean) => {
    if (open && !isOpen) {
      setPopupViewCount((count) => count + 1);
    }

    setIsOpen(open);
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-lg transition-all duration-300 subtle-scale ${
        isBestDeal
          ? "bg-card ring-2 ring-primary shadow-lg"
          : "bg-card hover:shadow-md"
      }`}
    >
      {/* Badge */}
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
          src={product.image}
          alt={product.name}
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
      <div className={`relative ${isBestDeal ? "px-6 py-4" : "p-4"} space-y-2`}>
        {/* Product Name */}
        <h3 className="text-sm font-semibold text-foreground line-clamp-2">
          {product.name}
        </h3>

        {/* Specs */}
        {product.specs && (
          <p className="text-xs text-muted-foreground">{product.specs}</p>
        )}

        {/* Seller and Stock */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">
            {product.seller}
          </p>
          {!product.inStock && (
            <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
              {t("outOfStock")}
            </span>
          )}
        </div>

        {/* Price Section */}
        <div
          className={`flex items-baseline gap-2 ${isBestDeal ? "pt-2 border-t border-border" : "pt-2"}`}
        >
          <span
            className={`font-grotesk font-bold text-primary ${
              isBestDeal ? "text-2xl" : "text-xl"
            }`}
          >
            ${product.price}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* CTA Button */}
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {t("popupTitle", { product: product.name })}
              </DialogTitle>
              <DialogDescription>
                {t("popupDescription", { seller: product.seller })}
              </DialogDescription>
            </DialogHeader>

            <div className="relative h-44 w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 420px"
              />
            </div>

            <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("price")}</span>
                <span className="font-semibold text-foreground">
                  ${product.price}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("retailer")}</span>
                <span className="font-medium text-foreground">
                  {product.seller}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("popupViews")}</span>
                <span className="inline-flex min-w-10 justify-center rounded-full bg-primary/15 px-3 py-1 text-primary font-semibold">
                  {popupViewCount}
                </span>
              </div>
            </div>

            <a
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {t("viewOffer")}
            </a>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

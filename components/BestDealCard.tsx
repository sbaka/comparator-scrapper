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

interface BestDealCardProps {
  product: Product;
}

export function BestDealCard({ product }: BestDealCardProps) {
  const t = useTranslations("bestDeal");
  const productCardT = useTranslations("productCard");
  const [isOpen, setIsOpen] = useState(false);
  const [popupViewCount, setPopupViewCount] = useState(0);

  const handleOpenChange = (open: boolean) => {
    if (open && !isOpen) {
      setPopupViewCount((count) => count + 1);
    }

    setIsOpen(open);
  };

  return (
    <div className="relative overflow-hidden rounded-lg bg-card ring-2 ring-primary shadow-xl hover:shadow-2xl transition-shadow">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />

      {/* Content wrapper */}
      <div className="relative flex flex-col md:flex-row gap-6 p-6 md:p-8">
        {/* Image section */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto rounded-lg overflow-hidden bg-muted shrink-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Text section */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          {/* Badge */}
          <div className="inline-flex w-fit">
            <div className="px-3 py-1 bg-linear-to-r from-primary to-transparent rounded-full">
              <span className="text-xs font-bold text-white uppercase tracking-widest">
                ✓ {t("badge")}
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-balance">
              {product.name}
            </h2>

            {product.specs && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.specs}
              </p>
            )}

            {/* Seller info */}
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground">
                {t("availableAt", { seller: product.seller })}
              </p>
            </div>
          </div>

          {/* Price highlight */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {t("priceLabel")}
            </p>
            <div className="flex items-baseline gap-3">
              <span className="font-grotesk text-4xl md:text-5xl font-bold text-primary">
                ${product.price}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
            </div>
          </div>

          {/* CTA */}
          <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                {t("cta")}
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {productCardT("popupTitle", { product: product.name })}
                </DialogTitle>
                <DialogDescription>
                  {productCardT("popupDescription", { seller: product.seller })}
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
                  <span className="text-muted-foreground">
                    {productCardT("price")}
                  </span>
                  <span className="font-semibold text-foreground">
                    ${product.price}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {productCardT("retailer")}
                  </span>
                  <span className="font-medium text-foreground">
                    {product.seller}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {productCardT("popupViews")}
                  </span>
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
                {productCardT("viewOffer")}
              </a>
            </DialogContent>
          </Dialog>

          {/* Stock status */}
          {product.inStock && (
            <p className="text-xs text-primary font-semibold">
              ✓ {t("inStockLimited")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

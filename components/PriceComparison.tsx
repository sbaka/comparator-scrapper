"use client";

import { useState, useMemo, useEffect } from "react";
import { sortByPrice, getBestDeal, getOtherOffers } from "@/lib/data";
import { SearchBar } from "./SearchBar";
import { BestDealCard } from "./BestDealCard";
import { ProductCard } from "./ProductCard";
import { useTranslations } from "next-intl";
import type { PriceComparisonProps, ProductSuggestion } from "@/interfaces";

export function PriceComparison({
  initialQuery = "",
  onClearQuery,
  onSearch,
  products,
  isLoading = false,
}: PriceComparisonProps) {
  const t = useTranslations("priceComparison");
  const searchT = useTranslations("search");
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const lowerQuery = searchQuery.trim().toLowerCase();

  useEffect(() => {
    if (searchQuery.trim() === "" && initialQuery.trim() !== "") {
      onClearQuery?.();
    }
  }, [searchQuery, initialQuery, onClearQuery]);

  const matchedProducts = useMemo(() => products, [products]);

  const suggestions = useMemo(() => {
    if (!lowerQuery) {
      return [];
    }

    const grouped = matchedProducts.reduce(
      (acc, product) => {
        if (!acc[product.name_product]) {
          acc[product.name_product] = {
            id: product.id_product,
            name: product.name_product,
            lowestPrice: Number(product.price_product),
          };

          return acc;
        }

        if (product.price_product < acc[product.name_product].lowestPrice) {
          acc[product.name_product].lowestPrice = Number(product.price_product);
        }

        return acc;
      },
      {} as Record<string, ProductSuggestion>,
    );

    return Object.values(grouped)
      .sort((a, b) => a.lowestPrice - b.lowestPrice)
      .map((suggestion) => ({
        id: suggestion.id,
        label: suggestion.name,
        subtitle: `${searchT("price")}: ${suggestion.lowestPrice} ${searchT("currency")}`,
      }));
  }, [matchedProducts, lowerQuery, searchT]);

  // Search and sort products
  const filteredProducts = useMemo(() => {
    return sortByPrice(matchedProducts);
  }, [matchedProducts]);

  // Get best deal and others
  const bestDeal = useMemo(
    () => getBestDeal(filteredProducts),
    [filteredProducts],
  );
  const otherOffers = useMemo(
    () => getOtherOffers(filteredProducts, bestDeal),
    [filteredProducts, bestDeal],
  );

  const hasResults = filteredProducts.length > 0;

  const handleSubmit = (query: string) => {
    const trimmed = query.trim();

    if (!trimmed) {
      onClearQuery?.();
      return;
    }

    onSearch?.(trimmed);
  };

  return (
    <div className="w-full">
      {/* Search Section */}
      <div className="mb-8">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={handleSubmit}
          suggestions={suggestions}
        />
      </div>

      {isLoading && (
        <div className="py-10 text-center text-muted-foreground">
          Loading products...
        </div>
      )}

      {!isLoading && !hasResults ? (
        // Empty state
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {t("emptyStateTitle")}
          </h2>
          <p className="text-muted-foreground max-w-md">
            {searchQuery
              ? `${t("emptyStateTitle")} "${searchQuery}". ${t("tryDifferentSearch")}`
              : t("startSearching")}
          </p>
        </div>
      ) : !isLoading ? (
        <div className="space-y-10">
          {/* Best Deal Section */}
          {bestDeal && (
            <section className="slide-up">
              <BestDealCard product={bestDeal} />
            </section>
          )}

          {/* Other Offers Section */}
          {otherOffers.length > 0 && (
            <section className="slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="mb-6">
                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  {t("allOffers")}
                </h2>
                <p className="text-lg font-semibold text-foreground mt-1">
                  {otherOffers.length}{" "}
                  {t("offers", { count: otherOffers.length })}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {otherOffers.map((product) => (
                  <ProductCard key={product.id_product} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : null}
    </div>
  );
}

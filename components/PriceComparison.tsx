"use client";

import { useState, useMemo, useEffect } from "react";
import {
  getProductsBySearch,
  getProductSuggestions,
  sortByPrice,
  getBestDeal,
  getOtherOffers,
} from "@/lib/data";
import { SearchBar } from "./SearchBar";
import { BestDealCard } from "./BestDealCard";
import { ProductCard } from "./ProductCard";
import { useTranslations } from "next-intl";

interface PriceComparisonProps {
  initialQuery?: string;
  onClearQuery?: () => void;
}

export function PriceComparison({
  initialQuery = "",
  onClearQuery,
}: PriceComparisonProps) {
  const t = useTranslations("priceComparison");
  const searchT = useTranslations("search");
  const categoryT = useTranslations("category");
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const suggestions = useMemo(() => {
    return getProductSuggestions(searchQuery).map((suggestion) => ({
      id: suggestion.id,
      label: suggestion.name,
      subtitle: searchT("suggestionTemplate", {
        category: categoryT(suggestion.category),
        price: suggestion.lowestPrice,
      }),
    }));
  }, [searchQuery, searchT, categoryT]);

  // Search and sort products
  const filteredProducts = useMemo(() => {
    const searched = getProductsBySearch(searchQuery);
    return sortByPrice(searched);
  }, [searchQuery]);

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

  useEffect(() => {
    if (searchQuery.trim() === "") {
      onClearQuery?.();
    }
  }, [searchQuery, onClearQuery]);

  return (
    <div className="w-full">
      {/* Search Section */}
      <div className="mb-8">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          suggestions={suggestions}
        />
      </div>

      {!hasResults ? (
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
      ) : (
        <div className="space-y-10">
          {/* Best Deal Section */}
          {bestDeal && (
            <section className="slide-up">
              <div className="mb-6">
                <h2 className="text-xs font-bold text-primary uppercase tracking-widest">
                  {t("featured")}
                </h2>
                <p className="text-lg font-semibold text-foreground mt-1">
                  {t("lowestPrice")}
                </p>
              </div>
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
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

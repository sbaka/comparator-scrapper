"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { SearchBar } from "./SearchBar";
import { fetchProducts } from "@/utils/supabase/queries";
import type { ProductSuggestion, Product } from "@/interfaces";
import { PriceComparison } from "./PriceComparison";

export function SearchLanding() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const headerT = useTranslations("header");
  const searchT = useTranslations("search");

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const products = await fetchProducts();
      setAllProducts(products);
      setIsLoading(false);
    };

    loadProducts();
  }, []);

  const suggestions = useMemo(() => {
    const lowerQuery = searchQuery.trim().toLowerCase();

    if (!lowerQuery) {
      return [];
    }

    const matchedProducts = allProducts.filter((product) => {
      return (
        product.name_product.toLowerCase().includes(lowerQuery) ||
        product.link_product.toLowerCase().includes(lowerQuery)
      );
    });

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
        subtitle: `${searchT("price")}: ${suggestion.lowestPrice} DZD`,
      }));
  }, [searchQuery, allProducts, searchT]);

  const handleSubmit = (query: string) => {
    const trimmed = query.trim();

    if (!trimmed) {
      return;
    }

    setSearchQuery(trimmed);
    setActiveQuery(trimmed);
  };

  const handleBackToLanding = () => {
    setActiveQuery("");
    setSearchQuery("");
  };

  const isShowingResults = activeQuery.length > 0;

  return (
    <div
      className={
        isShowingResults
          ? "w-full max-w-7xl mx-auto"
          : "w-full max-w-2xl mx-auto min-h-[calc(100vh-320px)] flex flex-col justify-center slide-up"
      }
    >
      {!isShowingResults ? (
        <>
          <div className="mb-8 text-center space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary">
              {headerT("title")}
            </p>
            <h1 className="font-grotesk text-4xl md:text-6xl font-bold text-balance text-foreground">
              {headerT("subtitle")}
            </h1>
          </div>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSubmit}
            suggestions={suggestions}
            onSuggestionSelect={(suggestion) => handleSubmit(suggestion.label)}
          />
        </>
      ) : (
        <PriceComparison
          initialQuery={activeQuery}
          onClearQuery={handleBackToLanding}
          products={allProducts}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

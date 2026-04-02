"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { SearchBar } from "./SearchBar";
import { getProductSuggestions } from "@/lib/data";
import { PriceComparison } from "./PriceComparison";

export function SearchLanding() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const headerT = useTranslations("header");
  const searchT = useTranslations("search");
  const categoryT = useTranslations("category");
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
        />
      )}
    </div>
  );
}

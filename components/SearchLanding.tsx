"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { SearchBar } from "./SearchBar";
import type { Product } from "@/interfaces";
import { PriceComparison } from "./PriceComparison";

interface SearchLandingProps {
  initialQuery?: string;
  products?: Product[];
}

export function SearchLanding({
  initialQuery = "",
  products = [],
}: SearchLandingProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const headerT = useTranslations("header");

  const runSearch = (query: string) => {
    const trimmed = query.trim();

    if (!trimmed) {
      return;
    }

    setSearchQuery(trimmed);
    const params = new URLSearchParams();
    params.set("q", trimmed);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSubmit = (query: string) => {
    runSearch(query);
  };

  const handleBackToLanding = () => {
    setSearchQuery("");
    router.push(pathname);
  };

  const isShowingResults = initialQuery.length > 0;

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
          />
        </>
      ) : (
        <PriceComparison
          initialQuery={initialQuery}
          onClearQuery={handleBackToLanding}
          onSearch={runSearch}
          products={products}
        />
      )}
    </div>
  );
}

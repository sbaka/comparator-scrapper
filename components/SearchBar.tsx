"use client";

import { useTranslations } from "next-intl";
import type { SearchBarProps } from "@/interfaces";
import { ArrowRight } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  onSubmit,
}: SearchBarProps) {
  const t = useTranslations("search");
  const isSearchActive = value.trim().length > 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onSubmit && isSearchActive) {
      e.preventDefault();
      onSubmit(value);
    }
  };

  const handleSubmitClick = () => {
    if (onSubmit && isSearchActive) {
      onSubmit(value);
    }
  };

  return (
    <form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit && isSearchActive) {
          onSubmit(value);
        }
      }}
    >
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("placeholder")}
          className="w-full px-6 py-3 pr-16 bg-card text-foreground placeholder-muted-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all subtle-scale"
          aria-label={t("ariaLabel")}
        />

        {/* Submit Button */}
        <button
          type="submit"
          onClick={handleSubmitClick}
          disabled={!isSearchActive}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
            isSearchActive
              ? "bg-primary text-primary-foreground hover:opacity-90 cursor-pointer"
              : "text-muted-foreground cursor-not-allowed opacity-50"
          }`}
          aria-label="Submit search"
        >
          <ArrowRight size={20} />
        </button>

        {/* Hint text */}
        {isSearchActive && (
          <div className="absolute left-6 top-full mt-2 text-xs text-muted-foreground animate-pulse">
            Press <kbd className="px-2 py-1 rounded bg-muted text-foreground font-semibold">Enter</kbd> or click arrow to search
          </div>
        )}
      </div>
    </form>
  );
}

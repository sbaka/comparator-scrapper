"use client";

import { useTranslations } from "next-intl";
import type { SearchBarProps, SearchSuggestion } from "@/interfaces";

export function SearchBar({
  value,
  onChange,
  onSubmit,
  suggestions = [],
  onSuggestionSelect,
}: SearchBarProps) {
  const t = useTranslations("search");
  const showSuggestions = value.trim().length > 0 && suggestions.length > 0;

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.label);

    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
  };

  const input = (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={t("placeholder")}
      className="w-full px-6 py-3 bg-card text-foreground placeholder-muted-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all subtle-scale"
      aria-label={t("ariaLabel")}
    />
  );

  const suggestionsList = showSuggestions ? (
    <div className="mt-3 max-h-72 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.id}
          type="button"
          onClick={() => handleSuggestionClick(suggestion)}
          className="w-full px-4 py-3 text-left hover:bg-muted/60 transition-colors border-b border-border last:border-b-0"
        >
          <p className="font-medium text-foreground">{suggestion.label}</p>
          {suggestion.subtitle && (
            <p className="text-sm text-muted-foreground mt-1">
              {suggestion.subtitle}
            </p>
          )}
        </button>
      ))}
    </div>
  ) : null;

  if (!onSubmit) {
    return (
      <div className="w-full">
        {input}
        {suggestionsList}
      </div>
    );
  }

  return (
    <form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
    >
      {input}
      {suggestionsList}
    </form>
  );
}

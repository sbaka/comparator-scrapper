export interface Product {
  created_at: string | null;
  id_product: string;
  name_product: string;
  img_product: string | null;
  price_product: number;
  link_product: string;
  id_source?: number | null;
  id_category?: number | null;
  source?:
    | {
        name_source: string;
      }
    | Array<{
        name_source: string;
      }>
    | null;
}

export interface ProductCardProps {
  product: Product;
  isBestDeal?: boolean;
}

export interface BestDealCardProps {
  product: Product;
}

export interface PriceComparisonProps {
  initialQuery?: string;
  onClearQuery?: () => void;
  onSearch?: (query: string) => void;
  products: Product[];
  isLoading?: boolean;
}

export interface SearchSuggestion {
  id: string;
  label: string;
  subtitle?: string;
}

export interface ProductSuggestion {
  id: string;
  name: string;
  lowestPrice: number;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  suggestions?: SearchSuggestion[];
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
}

export interface ViewersCountProps {
  id: string;
}

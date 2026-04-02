// Predefined color palette for sellers
const SELLER_COLORS = [
  { bg: "bg-blue-500", text: "text-blue-900", light: "bg-blue-100", border: "border-blue-300" },
  { bg: "bg-emerald-500", text: "text-emerald-900", light: "bg-emerald-100", border: "border-emerald-300" },
  { bg: "bg-amber-500", text: "text-amber-900", light: "bg-amber-100", border: "border-amber-300" },
  { bg: "bg-rose-500", text: "text-rose-900", light: "bg-rose-100", border: "border-rose-300" },
  { bg: "bg-purple-500", text: "text-purple-900", light: "bg-purple-100", border: "border-purple-300" },
  { bg: "bg-cyan-500", text: "text-cyan-900", light: "bg-cyan-100", border: "border-cyan-300" },
  { bg: "bg-orange-500", text: "text-orange-900", light: "bg-orange-100", border: "border-orange-300" },
  { bg: "bg-teal-500", text: "text-teal-900", light: "bg-teal-100", border: "border-teal-300" },
];

// Map seller names to consistent colors
const sellerColorMap: Record<string, typeof SELLER_COLORS[0]> = {};

export function getSellerColor(sellerName: string) {
  if (!sellerColorMap[sellerName]) {
    const colorIndex = Object.keys(sellerColorMap).length % SELLER_COLORS.length;
    sellerColorMap[sellerName] = SELLER_COLORS[colorIndex];
  }
  return sellerColorMap[sellerName];
}

export function resetSellerColorMap() {
  Object.keys(sellerColorMap).forEach(key => delete sellerColorMap[key]);
}

export type SellerColor = typeof SELLER_COLORS[0];

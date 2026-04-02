import type { Product } from "@/interfaces";

export const sortByPrice = (products: Product[]): Product[] => {
  return [...products].sort(
    (a, b) => Number(a.price_product) - Number(b.price_product),
  );
};

export const getBestDeal = (products: Product[]): Product | null => {
  if (products.length === 0) return null;

  const grouped = products.reduce(
    (acc, product) => {
      if (!acc[product.name_product]) {
        acc[product.name_product] = [];
      }
      acc[product.name_product].push(product);
      return acc;
    },
    {} as Record<string, Product[]>,
  );

  const cheapestByName = Object.values(grouped).map((group) =>
    group.reduce((min, p) =>
      Number(p.price_product) < Number(min.price_product) ? p : min,
    ),
  );

  return cheapestByName.reduce((min, p) =>
    Number(p.price_product) < Number(min.price_product) ? p : min,
  );
};

export const getOtherOffers = (
  products: Product[],
  bestDeal: Product | null,
): Product[] => {
  if (!bestDeal) return products;

  return products.filter((p) => p.id_product !== bestDeal.id_product);
};

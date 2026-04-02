export interface Product {
  id: string;
  name: string;
  category: "GPU" | "CPU" | "RAM" | "Storage" | "PSU" | "Cooling";
  seller: string;
  price: number;
  originalPrice?: number;
  image: string;
  link: string;
  inStock: boolean;
  specs?: string;
}

export interface ProductSuggestion {
  id: string;
  name: string;
  category: Product["category"];
  lowestPrice: number;
}

const baseProducts: Product[] = [
  // GPUs
  {
    id: "gpu-1",
    name: "RTX 4070 Ti SUPER",
    category: "GPU",
    seller: "Newegg",
    price: 799,
    originalPrice: 899,
    image:
      "https://images.unsplash.com/photo-1587829191301-4460bda35fac?w=400&h=300&fit=crop",
    link: "#",
    inStock: true,
    specs: "12GB GDDR6X",
  },
  {
    id: "gpu-2",
    name: "RTX 4070 Ti SUPER",
    category: "GPU",
    seller: "Amazon",
    price: 829,
    image:
      "https://images.unsplash.com/photo-1587829191301-4460bda35fac?w=400&h=300&fit=crop",
    link: "#",
    inStock: true,
    specs: "12GB GDDR6X",
  },
  {
    id: "gpu-3",
    name: "RTX 4070 Ti SUPER",
    category: "GPU",
    seller: "Best Buy",
    price: 849,
    image:
      "https://images.unsplash.com/photo-1587829191301-4460bda35fac?w=400&h=300&fit=crop",
    link: "#",
    inStock: true,
    specs: "12GB GDDR6X",
  },
  {
    id: "gpu-4",
    name: "RX 7700 XT",
    category: "GPU",
    seller: "Micro Center",
    price: 349,
    image:
      "https://images.unsplash.com/photo-1587829191301-4460bda35fac?w=400&h=300&fit=crop",
    link: "#",
    inStock: true,
    specs: "12GB GDDR6",
  },
  {
    id: "gpu-5",
    name: "RX 7700 XT",
    category: "GPU",
    seller: "Newegg",
    price: 369,
    image:
      "https://images.unsplash.com/photo-1587829191301-4460bda35fac?w=400&h=300&fit=crop",
    link: "#",
    inStock: true,
    specs: "12GB GDDR6",
  },

  // CPUs
  {
    id: "cpu-1",
    name: "Intel Core i9-14900K",
    category: "CPU",
    seller: "Micro Center",
    price: 549,
    originalPrice: 649,
    image:
      "https://images.unsplash.com/photo-1555588220-dfc0b5e02b20?w=400&h=300&fit=crop",
    link: "#",
    inStock: true,
    specs: "24 cores, 5.8 GHz",
  },
  {
    id: "cpu-2",
    name: "Intel Core i9-14900K",
    category: "CPU",
    seller: "Amazon",
    price: 579,
    image:
      "https://images.unsplash.com/photo-1555588220-dfc0b5e02b20?w=400&h=300&fit=crop",
    link: "#",
    inStock: true,
    specs: "24 cores, 5.8 GHz",
  },
  {
    id: "cpu-3",
    name: "Ryzen 9 7950X3D",
    category: "CPU",
    seller: "Newegg",
    price: 699,
    image:
      "https://images.unsplash.com/photo-1555588220-dfc0b5e02b20?w=400&h=300&fit=crop",
    link: "#",
    inStock: true,
    specs: "16 cores, 5.7 GHz",
  },
  {
    id: "cpu-4",
    name: "Ryzen 9 7950X3D",
    category: "CPU",
    seller: "Best Buy",
    price: 749,
    image:
      "https://images.unsplash.com/photo-1555588220-dfc0b5e02b20?w=400&h=300&fit=crop",
    link: "#",
    inStock: true,
    specs: "16 cores, 5.7 GHz",
  },

  // RAM
  {
    id: "ram-1",
    name: "Corsair Dominator DDR5 32GB (2x16GB)",
    category: "RAM",
    seller: "Micro Center",
    price: 179,
    originalPrice: 249,
    image:
      "https://images.unsplash.com/photo-1602730357227-88726059c31f?w=400&h=300&fit=crop",
    link: "#",
    inStock: true,
    specs: "6000MHz CAS 30",
  },
  {
    id: "ram-2",
    name: "Corsair Dominator DDR5 32GB (2x16GB)",
    category: "RAM",
    seller: "Amazon",
    price: 199,
    image:
      "https://images.unsplash.com/photo-1602730357227-88726059c31f?w=400&h=300&fit=crop",
    link: "#",
    inStock: true,
    specs: "6000MHz CAS 30",
  },
  {
    id: "ram-3",
    name: "G.Skill Trident Z5 DDR5 32GB",
    category: "RAM",
    seller: "Newegg",
    price: 149,
    image:
      "https://images.unsplash.com/photo-1602730357227-88726059c31f?w=400&h=300&fit=crop",
    link: "#",
    inStock: true,
    specs: "5600MHz CAS 28",
  },

  // Storage
  {
    id: "ssd-1",
    name: "Samsung 990 Pro 4TB NVMe",
    category: "Storage",
    seller: "Amazon",
    price: 349,
    originalPrice: 449,
    image:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop",
    link: "#",
    inStock: true,
    specs: "PCIe 4.0, 7100 MB/s",
  },
  {
    id: "ssd-2",
    name: "Samsung 990 Pro 4TB NVMe",
    category: "Storage",
    seller: "Newegg",
    price: 379,
    image:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop",
    link: "#",
    inStock: true,
    specs: "PCIe 4.0, 7100 MB/s",
  },
  {
    id: "ssd-3",
    name: "WD Black SN850X 4TB",
    category: "Storage",
    seller: "Best Buy",
    price: 329,
    image:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop",
    link: "#",
    inStock: true,
    specs: "PCIe 4.0, 7100 MB/s",
  },

  // PSU
  {
    id: "psu-1",
    name: "Corsair RM1000e 1000W",
    category: "PSU",
    seller: "Micro Center",
    price: 199,
    originalPrice: 249,
    image:
      "https://images.unsplash.com/photo-1621905251368-7b2c41a0e4d5?w=400&h=300&fit=crop",
    link: "#",
    inStock: true,
    specs: "80+ Gold, Modular",
  },
  {
    id: "psu-2",
    name: "Corsair RM1000e 1000W",
    category: "PSU",
    seller: "Amazon",
    price: 219,
    image:
      "https://images.unsplash.com/photo-1621905251368-7b2c41a0e4d5?w=400&h=300&fit=crop",
    link: "#",
    inStock: true,
    specs: "80+ Gold, Modular",
  },
  {
    id: "psu-3",
    name: "EVGA SuperNOVA 850W",
    category: "PSU",
    seller: "Newegg",
    price: 159,
    image:
      "https://images.unsplash.com/photo-1621905251368-7b2c41a0e4d5?w=400&h=300&fit=crop",
    link: "#",
    inStock: true,
    specs: "80+ Gold, Modular",
  },

  // Cooling
  {
    id: "cooling-1",
    name: "Noctua NH-D15",
    category: "Cooling",
    seller: "Amazon",
    price: 99,
    image:
      "https://images.unsplash.com/photo-1563825481-98d72c6c3f0f?w=400&h=300&fit=crop",
    link: "#",
    inStock: true,
    specs: "Air Cooler, LGA1700",
  },
  {
    id: "cooling-2",
    name: "Corsair H150i Elite Capellix",
    category: "Cooling",
    seller: "Newegg",
    price: 189,
    originalPrice: 229,
    image:
      "https://images.unsplash.com/photo-1563825481-98d72c6c3f0f?w=400&h=300&fit=crop",
    link: "#",
    inStock: true,
    specs: "AIO Liquid, 360mm",
  },
  {
    id: "cooling-3",
    name: "NZXT Kraken X63",
    category: "Cooling",
    seller: "Best Buy",
    price: 179,
    image:
      "https://images.unsplash.com/photo-1563825481-98d72c6c3f0f?w=400&h=300&fit=crop",
    link: "#",
    inStock: true,
    specs: "AIO Liquid, 280mm",
  },
];

export const products: Product[] = baseProducts.map((product) => ({
  ...product,
  image: `https://picsum.photos/seed/${product.id}/400/300`,
}));

export const getProductsBySearch = (query: string): Product[] => {
  if (!query.trim()) return products;

  const lowerQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      product.specs?.toLowerCase().includes(lowerQuery),
  );
};

export const getProductSuggestions = (query: string): ProductSuggestion[] => {
  const trimmed = query.trim();

  if (!trimmed) {
    return [];
  }

  const matched = getProductsBySearch(trimmed);
  const grouped = matched.reduce(
    (acc, product) => {
      if (!acc[product.name]) {
        acc[product.name] = {
          id: product.id,
          name: product.name,
          category: product.category,
          lowestPrice: product.price,
        };
        return acc;
      }

      if (product.price < acc[product.name].lowestPrice) {
        acc[product.name].lowestPrice = product.price;
      }

      return acc;
    },
    {} as Record<string, ProductSuggestion>,
  );

  return Object.values(grouped).sort((a, b) => a.lowestPrice - b.lowestPrice);
};

export const sortByPrice = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => a.price - b.price);
};

export const getBestDeal = (products: Product[]): Product | null => {
  if (products.length === 0) return null;

  // Group by product name
  const grouped = products.reduce(
    (acc, product) => {
      if (!acc[product.name]) {
        acc[product.name] = [];
      }
      acc[product.name].push(product);
      return acc;
    },
    {} as Record<string, Product[]>,
  );

  // Find cheapest in each group
  const cheapest = Object.values(grouped).map((group) =>
    group.reduce((min, p) => (p.price < min.price ? p : min)),
  );

  // Return overall cheapest
  return cheapest.reduce((min, p) => (p.price < min.price ? p : min));
};

export const getOtherOffers = (
  products: Product[],
  bestDeal: Product | null,
): Product[] => {
  if (!bestDeal) return products;

  return products.filter((p) => p.id !== bestDeal.id);
};

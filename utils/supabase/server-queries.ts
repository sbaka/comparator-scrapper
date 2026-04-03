import "server-only";

import { cookies } from "next/headers";
import type { Product } from "@/interfaces";
import { createClient } from "./server";

export const searchProductsServer = async (
  query: string,
  limit = 80,
): Promise<Product[]> => {
  const normalizedQuery = query.trim().replace(/\s+/g, " ");

  if (!normalizedQuery) {
    return [];
  }

  const supabase = createClient(cookies());

  const { data, error } = await supabase
    .from("product")
    .select(
      "created_at,id_product,name_product,img_product,price_product,link_product,id_source,id_category,source(name_source)",
    )
    .textSearch("name_product", normalizedQuery, {
      type: "websearch",
      config: "simple",
    })
    .order("price_product", { ascending: true })
    .limit(limit);

  if (!error) {
    return (data ?? []) as Product[];
  }

  console.error("Error in full-text search, using fallback:", error.message);

  const { data: fallbackData, error: fallbackError } = await supabase
    .from("product")
    .select(
      "created_at,id_product,name_product,img_product,price_product,link_product,id_source,id_category,source(name_source)",
    )
    .ilike("name_product", `%${normalizedQuery}%`)
    .order("price_product", { ascending: true })
    .limit(limit);

  if (fallbackError) {
    console.error("Error searching products:", fallbackError.message);
    return [];
  }

  return (fallbackData ?? []) as Product[];
};

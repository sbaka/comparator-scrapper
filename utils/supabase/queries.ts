import { createClient } from "./client";
import type { Product } from "@/interfaces";

export const fetchProducts = async (): Promise<Product[]> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("product")
    .select(
      "created_at,id_product,name_product,img_product,price_product,link_product,id_source,id_category,source(name_source)",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error.message);
    return [];
  }

  return (data ?? []) as Product[];
};

export const getProduct = async (
  id_product: string,
): Promise<Product | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("product")
    .select(
      "created_at,id_product,name_product,img_product,price_product,link_product,id_source,id_category,source(name_source)",
    )
    .eq("id_product", id_product)
    .maybeSingle();

  if (error || !data) {
    console.error("Error fetching product:", error?.message ?? "Not found");
    return null;
  }

  return data as Product;
};

export const handleComment = async (
  id: string,
  text: string,
  localTime: string,
) => {
  const supabase = createClient();

  const commentData = {
    id_product: id,
    content_comment: text,
    name_comment: text,
    created_at: localTime,
  };

  const { error } = await supabase.from("comment").insert([commentData]);

  if (error) {
    console.error("Error inserting comment:", error.message);
  }
};

"use server";
import { createClient } from "./client";


export const getProduct = async (link_product: any) => {
  const supabase = createClient();
  console.log(link_product)
    const result:Product = {created_at: "", id_product: "", name_product: "", img_product: "", price_product: 0, link_product: ""};
  const { data } = await supabase
    .from("product")
    .select("*")
    .eq("id_product", link_product);
  if(data) {
    result.created_at = data[0].created_at;
    result.id_product = data[0].id_product;
    result.name_product = data[0].name_product;
    result.img_product = data[0].img_product;
    result.price_product = data[0].price_product;
    result.link_product = data[0].link_product;
  }else{
    console.error("Error fetching product:", data);
  }
  return result;
};
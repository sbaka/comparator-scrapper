"use server";
import ViewersCount from '@/components/viewersCount';
import CommentInput from '@/components/commentInput';
import { getProduct } from "@/utils/supabase/queries";


const Page = async ({ params }: { params: Promise<{ id: string }> }) => {

  const id = (await params).id;
  console.log("Product ID:", id);
  const 
    [product]  =await Promise.all([
    getProduct(id),
  ]);

  return (
    <div>
      <h1>Product: {id}</h1>
      <h2>Product name: {product.name_product || "Product not found"}</h2>
      <h3>Price: ${product.price_product.toFixed(2)}</h3>
      <h3>Link: {product.link_product}</h3>
      <img src={product.img_product} alt={product.name_product} />
      
      <ViewersCount id={id} />
      <CommentInput id={id} />
    </div>
  );
}
export default Page;
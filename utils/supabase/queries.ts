import { createClient } from "./client";

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

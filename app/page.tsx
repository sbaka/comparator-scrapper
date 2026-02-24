import Image from "next/image";

export default async function Home() {
  const role = await fetchProducts();

  return (
    <>
      <div>{`Products: ${JSON.stringify(role)}`}</div>
    </>
  );
}

async function fetchProducts() {
  const baseUrl = "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/py/products?query=${"rtx 5060"}`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const role = await response.json();
    return role;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
}

import Image from "next/image";

export default async function Home() {
  const role = await carwl();

  return (
    <>
      <div>{`Products: ${JSON.stringify(role)}`}</div>
    </>
  );
}

async function carwl() {
  const baseUrl = "http://localhost:3000";

  const response = await fetch(`${baseUrl}/crawl`, {
    method: "GET",
  });
  return "running";
}

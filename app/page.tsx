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

  console.log(`${baseUrl}/api/py/crawl`);

  const response = await fetch(`${baseUrl}/api/py/crawl`, {
    method: "GET",
  });
  return "running";
}

import Image from "next/image";

export default async function Home() {
  const role = await fetchEngineerRole();

  return (
    <>
      <div>{`The main skill of a ${role.title} is ${role.mainskill}.`}</div>
    </>
  );
}

async function fetchEngineerRole() {
  const baseUrl = "http://localhost:3000";

  try {
    const response = await fetch(
      `${baseUrl}/api/py/engineer-roles?title=${"Software Architect"}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const role = await response.json();
    return role;
  } catch (error) {
    console.error("Error fetching engineer role:", error);
    return null;
  }
}

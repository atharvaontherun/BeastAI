const COMPANION_URL =
  process.env.NEXT_PUBLIC_COMPANION_URL || "http://localhost:4567";

export async function openDesktopApp(app: string) {
  const response = await fetch(`${COMPANION_URL}/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ app }),
  });

  return response.json();
}
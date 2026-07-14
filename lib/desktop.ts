export async function openDesktopApp(app: string) {
  const response = await fetch("http://localhost:4567/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ app }),
  });

  return response.json();
}
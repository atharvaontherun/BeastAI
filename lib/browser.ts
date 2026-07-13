const websites: Record<string, string> = {
  youtube: "https://youtube.com",
  google: "https://google.com",
  gmail: "https://mail.google.com",
  github: "https://github.com",
  spotify: "https://open.spotify.com",
  chatgpt: "https://chatgpt.com",
  instagram: "https://instagram.com",
  reddit: "https://reddit.com",
  whatsapp: "https://web.whatsapp.com",
};

export function openWebsite(target: string) {
  const url = websites[target.toLowerCase()];
  if (!url) return false;

  window.open(url, "_blank");
  return true;
}
export type BrainAction =
  | "CHAT"
  | "OPEN_WEBSITE"
  | "SEARCH_WEB";

export interface BrainDecision {
  action: BrainAction;
  target?: string;
  query?: string;
}

export function think(input: string): BrainDecision {
  const text = input.trim().toLowerCase();

  if (text.startsWith("open ")) {
    return {
      action: "OPEN_WEBSITE",
      target: text.replace("open", "").trim(),
    };
  }

  if (text.startsWith("search ")) {
    return {
      action: "SEARCH_WEB",
      query: text.replace("search", "").trim(),
    };
  }

  return {
    action: "CHAT",
  };
}
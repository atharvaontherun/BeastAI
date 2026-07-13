export type Intent =
  | "CHAT"
  | "OPEN_WEBSITE"
  | "SEARCH_WEB"
  | "UNKNOWN";

export interface IntentResult {
  intent: Intent;
  target?: string;
  query?: string;
}
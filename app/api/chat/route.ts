import { groq } from "@ai-sdk/groq";
import { JARVIS_PERSONALITY } from "@/lib/jarvis-personality";
import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: JARVIS_PERSONALITY,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}

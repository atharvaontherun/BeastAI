export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { text }: { text: string } = await req.json();

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID;

    if (!apiKey || !voiceId) {
      return Response.json(
        { error: "Voice output is not configured." },
        { status: 500 }
      );
    }

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5",
        }),
      }
    );

    if (!res.ok) {
      const detail = await res.text();
      console.error(detail);

      return Response.json(
        {
          error: "ElevenLabs request failed",
          detail,
        },
        { status: res.status }
      );
    }

    return new Response(res.body, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (err) {
    console.error(err);

    return Response.json(
      {
        error: "Internal server error",
        detail: String(err),
      },
      { status: 500 }
    );
  }
}
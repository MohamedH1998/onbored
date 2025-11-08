import { decompressPayload } from "../../lib/decompress";
import { parseReplayPayload } from "../../lib/validate";
import { sendToTinybird } from "../../lib/send-to-tinybird";
import type { Env } from "../../worker";
import { handleRateLimitError } from "../../lib/helpers";

export async function POST(req: Request, env: Env) {
  try {
    if (req.headers.get("content-type") !== "application/x-ndjson") {
      return new Response("Invalid content type", { status: 400 });
    }

    const compressed = new Uint8Array(await req.arrayBuffer());

    if (!compressed.length) {
      return new Response("Invalid compressed data", { status: 400 });
    }

    const decompressed = decompressPayload(compressed);

    const payload = parseReplayPayload(decompressed);

    const { success } = await handleRateLimitError({
      env,
      projectKey: payload.projectKey,
    });

    if (!success) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          project_key: payload.projectKey,
          limit: 10000,
          window: 3600,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "3600",
            "X-RateLimit-Limit": "10000",
            "X-RateLimit-Window": "3600",
          },
        },
      );
    }

    const response = await sendToTinybird(payload, env);

    if (!response.ok) {
      const errorMessage = response.error || "Something went wrong";
      return new Response(`[TINYBIRD]: ${errorMessage}`, {
        status: 500,
      });
    }
    return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
  } catch (err) {
    console.error(`❌ [SESSION-REPLAY] Processing failed:`, err);
    return new Response("Upload error", { status: 500 });
  }
}

export async function GET(req: Request, env: Env) {
  return new Response("Hello, world!", { status: 200 });
}

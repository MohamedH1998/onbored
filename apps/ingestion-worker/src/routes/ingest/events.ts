import { handleRateLimitError, syncAccountIfNew } from "../../lib/helpers";
import type { Env } from "../../worker";
import type { ExecutionContext } from "@cloudflare/workers-types";

export async function POST(req: Request, env: Env, ctx: ExecutionContext) {
  try {
    const events = await req.json();

    if (!Array.isArray(events)) {
      return new Response(
        JSON.stringify({ error: "Expected array of events" }),
        { status: 400 },
      );
    }

    const projectKey = events[0].project_key;
    const success = await handleRateLimitError({
      env,
      projectKey,
    });

    if (!success) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          project_key: projectKey,
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

    const ndjson = events.map((event: any) => JSON.stringify(event)).join("\n");

    const response = await fetch(
      `${env.TINYBIRD_BASE_URL}/events?name=events&wait=true`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.TINYBIRD_WRITE_TOKEN}`,
          "Content-Type": "application/x-ndjson",
        },
        body: ndjson,
      },
    );

    if (!response.ok) {
      console.error("❌ Tinybird ingest error", response.statusText);
      return new Response("Tinybird failed", { status: 500 });
    }

    const first = events.find((e: any) => e.account_id && e.project_key);
    if (first) {
      syncAccountIfNew(env, ctx, first.project_key, first.account_id);
    }

    return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
  } catch (err) {
    console.error("❌ [Replay Upload] Failure", err);
    return new Response("Upload error", { status: 500 });
  }
}

export async function GET(req: Request, env: Env) {
  return new Response("Hello, world!", { status: 200 });
}

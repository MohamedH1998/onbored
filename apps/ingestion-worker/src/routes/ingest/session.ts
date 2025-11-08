import * as z from "zod/v4-mini";
import type { Env } from "../../worker";
import type { ExecutionContext } from "@cloudflare/workers-types";
import { handleRateLimitError, syncAccountIfNew } from "../../lib/helpers";

const sessionPayloadSchema = z.object({
  id: z.string(),
  project_key: z.string(),
  user_id: z.nullable(z.string()),
  account_id: z.optional(z.nullable(z.string())),
  user_traits: z.record(z.string(), z.any()),
  account_traits: z.record(z.string(), z.any()),
  started_at: z.string(),
});

export async function POST(req: Request, env: Env, ctx: ExecutionContext) {
  try {
    const session = await req.json();
    const parsedSession = sessionPayloadSchema.parse(session);

    const { success } = await handleRateLimitError({
      env,
      projectKey: parsedSession.project_key,
    });
    if (!success) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          project_key: parsedSession.project_key,
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

    const response = await fetch(
      `${env.TINYBIRD_BASE_URL}/events?name=sessions&wait=true`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.TINYBIRD_WRITE_TOKEN}`,
          "Content-Type": "application/x-ndjson",
        },
        body: JSON.stringify(parsedSession),
      },
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`[TINYBIRD]: ${errorMessage}`, response);
      return new Response(`[TINYBIRD]: ${errorMessage}`, { status: 500 });
    }

    if (parsedSession.account_id) {
      await syncAccountIfNew(
        env,
        ctx,
        parsedSession.project_key,
        parsedSession.account_id,
      );
    }

    return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
  } catch (err) {
    const errorMessage = "Something went wrong";
    console.error(`[TINYBIRD]: ${errorMessage}`, err);
    return new Response(errorMessage, { status: 500 });
  }
}

export async function GET(req: Request, env: Env) {
  return new Response("Hello, world!", { status: 200 });
}

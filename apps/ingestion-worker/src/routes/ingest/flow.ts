import z from "zod";
import type { Env } from "../../worker";
import type { ExecutionContext } from "@cloudflare/workers-types";

import { eventPayloadSchema } from "../types";
import { handleRateLimitError, syncAccountIfNew } from "../../lib/helpers";

export async function POST(req: Request, env: Env, ctx: ExecutionContext) {
  try {
    const flow = await req.json();

    const parsedFlow = eventPayloadSchema.parse(flow);

    const { success } = await handleRateLimitError({
      env,
      projectKey: parsedFlow.project_key,
    });

    if (!success) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          project_key: parsedFlow.project_key,
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

    const ndjson = JSON.stringify(parsedFlow);

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
      const errorMessage = await response.text();
      console.error(`[TINYBIRD]: ${errorMessage}`, response);
      return new Response(`[TINYBIRD]: ${errorMessage}`, { status: 500 });
    }

    if (parsedFlow.account_id) {
      await syncAccountIfNew(
        env,
        ctx,
        parsedFlow.project_key,
        parsedFlow.account_id,
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

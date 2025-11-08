import { Router } from "itty-router";
import * as sessionReplayHandler from "./session-replay";
import * as sessionHandler from "./session";
import * as eventsHandler from "./events";
import * as flowHandler from "./flow";
import type { Env } from "../../worker";
import { corsMiddleware } from "../../lib/cors-middleware";
import { ExecutionContext } from "@cloudflare/workers-types";

const router = Router();

router.options("/ingest/session-replay", (req: Request) => {
  const corsHeaders = corsMiddleware(req);
  if (corsHeaders instanceof Response) {
    return corsHeaders;
  }

  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
});

router.post("/ingest/session-replay", async (req: Request, env: Env) => {
  const response = await sessionReplayHandler.POST(req, env);
  const headers = { ...response.headers, ...corsMiddleware(req) };
  return new Response(response.body, {
    status: response.status,
    headers,
  });
});

router.get("/ingest/session-replay", async (req: Request, env: Env) => {
  const response = await sessionReplayHandler.GET(req, env);
  const headers = { ...response.headers, ...corsMiddleware(req) };
  return new Response(response.body, {
    status: response.status,
    headers,
  });
});

// session
router.options("/ingest/session", (req: Request) => {
  const corsHeaders = corsMiddleware(req);
  if (corsHeaders instanceof Response) {
    return corsHeaders;
  }

  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
});

router.post(
  "/ingest/session",
  async (req: Request, env: Env, ctx: ExecutionContext) => {
    const response = await sessionHandler.POST(req, env, ctx);
    const headers = { ...response.headers, ...corsMiddleware(req) };
    return new Response(response.body, {
      status: response.status,
      headers,
    });
  },
);

router.get("/ingest/session", async (req: Request, env: Env) => {
  const response = await sessionHandler.GET(req, env);
  const headers = { ...response.headers, ...corsMiddleware(req) };
  return new Response(response.body, {
    status: response.status,
    headers,
  });
});

// events
router.options("/ingest/events", (req: Request) => {
  const corsHeaders = corsMiddleware(req);
  if (corsHeaders instanceof Response) {
    return corsHeaders;
  }

  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
});

router.post(
  "/ingest/events",
  async (req: Request, env: Env, ctx: ExecutionContext) => {
    const response = await eventsHandler.POST(req, env, ctx);
    const headers = { ...response.headers, ...corsMiddleware(req) };
    return new Response(response.body, {
      status: response.status,
      headers,
    });
  },
);

router.get("/ingest/events", async (req: Request, env: Env) => {
  const response = await eventsHandler.GET(req, env);
  const headers = { ...response.headers, ...corsMiddleware(req) };
  return new Response(response.body, {
    status: response.status,
    headers,
  });
});

router.options("/ingest/flow", (req: Request) => {
  const corsHeaders = corsMiddleware(req);
  if (corsHeaders instanceof Response) {
    return corsHeaders;
  }

  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
});

router.post(
  "/ingest/flow",
  async (req: Request, env: Env, ctx: ExecutionContext) => {
    const response = await flowHandler.POST(req, env, ctx);
    const headers = { ...response.headers, ...corsMiddleware(req) };
    return new Response(response.body, {
      status: response.status,
      headers,
    });
  },
);

router.get("/ingest/flow", async (req: Request, env: Env) => {
  const response = await flowHandler.GET(req, env);
  const headers = { ...response.headers, ...corsMiddleware(req) };
  return new Response(response.body, {
    status: response.status,
    headers,
  });
});

export default router;

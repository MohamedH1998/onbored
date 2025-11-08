import { Router } from "itty-router";
import ingestRouter from "./routes/ingest";
import queryRouter from "./routes/query";
import { KVNamespace } from "@cloudflare/workers-types";

interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export interface Env {
  TINYBIRD_WRITE_TOKEN: string;
  TINYBIRD_BASE_URL: string;
  TINYBIRD_READ_TOKEN: string;
  PROJECT_RATE_LIMITER: RateLimiter;
  CUSTOMER_ACCOUNT_CACHE: KVNamespace;
  ENVIRONMENT?: string;
  WEB_APP_URL?: string;
  SYNC_SECRET?: string;
}

const router = Router();

router.all("/ingest/*", (req: Request, env: Env, ctx: any) => {
  return ingestRouter.handle(req, env, ctx);
});

router.all("/query/*", (req: Request, env: Env, ctx: any) => {
  return queryRouter.handle(req, env, ctx);
});

router.all("*", () => new Response("Not Found", { status: 404 }));

export default {
  async fetch(req: Request, env: Env, ctx: any) {
    return router.handle(req, env, ctx);
  },
};

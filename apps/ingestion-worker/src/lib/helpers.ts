import type { Env } from "../worker";
import type { ExecutionContext } from "@cloudflare/workers-types";

export const handleRateLimitError = async ({
  env,
  projectKey,
}: {
  env: Env;
  projectKey: string | null | undefined;
}) => {
  if (!projectKey) {
    return { success: false };
  }

  const { success } = await env.PROJECT_RATE_LIMITER.limit({
    key: projectKey,
  });

  return { success };
};

export const syncAccountIfNew = async (
  env: Env,
  ctx: ExecutionContext,
  projectKey: string,
  accountId: string,
) => {
  if (!env.WEB_APP_URL || !env.SYNC_SECRET || !accountId) return;

  const cacheKey = `${projectKey}:${accountId}`;
  const cached = await env.CUSTOMER_ACCOUNT_CACHE.get(cacheKey);

  if (cached) return;
  ctx.waitUntil(
    fetch(`${env.WEB_APP_URL}/api/webhooks/sync-customer-accounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.SYNC_SECRET}`,
      },
      body: JSON.stringify({ account_id: accountId, project_key: projectKey }),
    })
      .then((res) => {
        if (res.ok) {
          return env.CUSTOMER_ACCOUNT_CACHE.put(cacheKey, "1", {
            expirationTtl: 2592000,
          });
        } else {
          console.error(`[Sync] Failed: ${res.status}`, accountId);
        }
      })
      .catch((err) => console.error("[Sync] Error:", err)),
  );
};

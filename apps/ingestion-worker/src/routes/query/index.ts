import { Router } from "itty-router";
import type { Env } from "../../worker";
import { handleRateLimitError } from "../../lib/helpers";

const router = Router();

router.all("/query/*", async (req: Request, env: Env) => {
  const url = new URL(req.url);
  const projectKey = url.searchParams.get("project_key");
  const { success } = await handleRateLimitError({
    env,
    projectKey,
  });

  if (!success) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": "3600",
        "X-RateLimit-Limit": "10000",
        "X-RateLimit-Window": "3600",
      },
    });
  }
});

router.get("/query/funnel_step_metrics", async (req: Request, env: Env) => {
  try {
    const url = new URL(req.url);
    const funnelSlug = url.searchParams.get("funnel_slug");
    const projectKey = url.searchParams.get("project_key");
    const startDate = url.searchParams.get("start_date");
    const endDate = url.searchParams.get("end_date");

    if (!funnelSlug || !projectKey || !startDate || !endDate) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required parameters: funnel_slug, project_key, start_date, end_date",
        }),
        {
          status: 400,
        },
      );
    }

    const encodedFunnelSlug = encodeURIComponent(funnelSlug);
    const encodedProjectKey = encodeURIComponent(projectKey);
    const encodedStartDate = encodeURIComponent(startDate);
    const encodedEndDate = encodeURIComponent(endDate);

    const tinybirdUrl = `${env.TINYBIRD_BASE_URL}/pipes/funnel_step_metrics.json?token=${env.TINYBIRD_READ_TOKEN}&funnel_slug=${encodedFunnelSlug}&project_key=${encodedProjectKey}&start_date=${encodedStartDate}&end_date=${encodedEndDate}`;
    const response = await fetch(tinybirdUrl);

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching funnel step metrics:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
});

router.get("/query/flow_summary_by_funnel", async (req: Request, env: Env) => {
  try {
    const url = new URL(req.url);
    const funnelSlug = url.searchParams.get("funnel_slug");
    const projectKey = url.searchParams.get("project_key");
    const startDate = url.searchParams.get("start_date");
    const endDate = url.searchParams.get("end_date");

    if (!funnelSlug || !projectKey || !startDate || !endDate) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required parameters: funnel_slug, project_key, start_date, end_date",
        }),
        {
          status: 400,
        },
      );
    }

    const encodedFunnelSlug = encodeURIComponent(funnelSlug);
    const encodedProjectKey = encodeURIComponent(projectKey);
    const encodedStartDate = encodeURIComponent(startDate);
    const encodedEndDate = encodeURIComponent(endDate);

    const tinybirdUrl = `${env.TINYBIRD_BASE_URL}/pipes/flow_summary_by_funnel.json?token=${env.TINYBIRD_READ_TOKEN}&funnel_slug=${encodedFunnelSlug}&project_key=${encodedProjectKey}&start_date=${encodedStartDate}&end_date=${encodedEndDate}`;

    const response = await fetch(tinybirdUrl);
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching funnel step metrics:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
});

router.get(
  "/query/funnel_last_step_dropoffs",
  async (req: Request, env: Env) => {
    try {
      const url = new URL(req.url);
      const funnelSlug = url.searchParams.get("funnel_slug");
      const projectKey = url.searchParams.get("project_key");
      const startDate = url.searchParams.get("start_date");
      const endDate = url.searchParams.get("end_date");

      if (!funnelSlug || !projectKey || !startDate || !endDate) {
        return new Response(
          JSON.stringify({
            error:
              "Missing required parameters: funnel_slug, project_key, start_date, end_date",
          }),
          {
            status: 400,
          },
        );
      }

      const encodedFunnelSlug = encodeURIComponent(funnelSlug);
      const encodedProjectKey = encodeURIComponent(projectKey);
      const encodedStartDate = encodeURIComponent(startDate);
      const encodedEndDate = encodeURIComponent(endDate);

      const tinybirdUrl = `${env.TINYBIRD_BASE_URL}/pipes/funnel_last_step_dropoffs.json?token=${env.TINYBIRD_READ_TOKEN}&funnel_slug=${encodedFunnelSlug}&project_key=${encodedProjectKey}&start_date=${encodedStartDate}&end_date=${encodedEndDate}`;

      const response = await fetch(tinybirdUrl);
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
      });
    } catch (error) {
      console.error("Error fetching funnel last step dropoffs:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
      });
    }
  },
);

router.get("/query/funnel_dropoffs_by_step", async (req: Request, env: Env) => {
  try {
    const url = new URL(req.url);
    const funnelSlug = url.searchParams.get("funnel_slug");
    const projectKey = url.searchParams.get("project_key");
    const startDate = url.searchParams.get("start_date");
    const endDate = url.searchParams.get("end_date");
    const stepId = url.searchParams.get("step_id");

    if (!funnelSlug || !projectKey || !startDate || !endDate || !stepId) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required parameters: funnel_slug, project_key, start_date, end_date, step_id",
        }),
        {
          status: 400,
        },
      );
    }
    const encodedFunnelSlug = encodeURIComponent(funnelSlug);
    const encodedProjectKey = encodeURIComponent(projectKey);
    const encodedStartDate = encodeURIComponent(startDate);
    const encodedEndDate = encodeURIComponent(endDate);
    const encodedStepId = encodeURIComponent(stepId);

    const tinybirdUrl = `${env.TINYBIRD_BASE_URL}/pipes/funnel_dropoffs_by_step.json?token=${env.TINYBIRD_READ_TOKEN}&funnel_slug=${encodedFunnelSlug}&project_key=${encodedProjectKey}&start_date=${encodedStartDate}&end_date=${encodedEndDate}&step_id=${encodedStepId}`;

    const response = await fetch(tinybirdUrl);
    const data = await response.json();
    if (data.error) {
      return new Response(JSON.stringify({ error: data.error }), {
        status: 500,
      });
    }
    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching funnel last step dropoffs:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
});

router.get("/query/session_replay", async (req: Request, env: Env) => {
  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("session_id");
    const projectKey = url.searchParams.get("project_key");

    if (!sessionId || !projectKey) {
      return new Response(
        JSON.stringify({
          error: "Missing required parameters: session_id, project_key",
        }),
        {
          status: 400,
        },
      );
    }
    const encodedSessionId = encodeURIComponent(sessionId);
    const encodedProjectKey = encodeURIComponent(projectKey);

    const tinybirdUrl = `${env.TINYBIRD_BASE_URL}/pipes/session_replay_events_by_session_id.json?token=${env.TINYBIRD_READ_TOKEN}&session_id=${encodedSessionId}&project_key=${encodedProjectKey}`;

    const response = await fetch(tinybirdUrl);
    const data = await response.json();
    if (data.error) {
      return new Response(JSON.stringify({ error: data.error }), {
        status: 500,
      });
    }
    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching session replay:", error);
  }
});

router.get("/query/account_funnel_summary", async (req: Request, env: Env) => {
  try {
    const url = new URL(req.url);
    const funnelSlug = url.searchParams.get("funnel_slug");
    const projectKey = url.searchParams.get("project_key");
    const startDate = url.searchParams.get("start_date");
    const endDate = url.searchParams.get("end_date");
    const accountId = url.searchParams.get("account_id");

    if (!funnelSlug || !projectKey || !startDate || !endDate) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required parameters: funnel_slug, project_key, start_date, end_date",
        }),
        {
          status: 400,
        },
      );
    }

    const encodedFunnelSlug = encodeURIComponent(funnelSlug);
    const encodedProjectKey = encodeURIComponent(projectKey);
    const encodedStartDate = encodeURIComponent(startDate);
    const encodedEndDate = encodeURIComponent(endDate);
    const accountIdParam = accountId
      ? `&account_id=${encodeURIComponent(accountId)}`
      : "";

    const tinybirdUrl = `${env.TINYBIRD_BASE_URL}/pipes/account_funnel_summary.json?token=${env.TINYBIRD_READ_TOKEN}&funnel_slug=${encodedFunnelSlug}&project_key=${encodedProjectKey}&start_date=${encodedStartDate}&end_date=${encodedEndDate}${accountIdParam}`;
    const response = await fetch(tinybirdUrl);

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching funnel step metrics:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
});

router.get(
  "/query/account_engagement_trend",
  async (req: Request, env: Env) => {
    try {
      const url = new URL(req.url);
      const projectKey = url.searchParams.get("project_key");
      const accountId = url.searchParams.get("account_id");
      const startDate = url.searchParams.get("start_date");
      const endDate = url.searchParams.get("end_date");

      if (!projectKey) {
        return new Response(
          JSON.stringify({
            error:
              "Missing required parameters: project_key, start_date, end_date",
          }),
          {
            status: 400,
          },
        );
      }

      const accountIdParam = accountId
        ? `&account_id=${encodeURIComponent(accountId)}`
        : "";

      const tinybirdUrl = `${env.TINYBIRD_BASE_URL}/pipes/account_engagement_trend.json?token=${env.TINYBIRD_READ_TOKEN}&project_key=${projectKey}&start_date=${startDate}&end_date=${endDate}${accountIdParam}`;
      const response = await fetch(tinybirdUrl);
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
      });
    } catch (error) {
      console.error("Error fetching account engagement trend:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
      });
    }
  },
);

router.get("/query/funnel_dropoff_details", async (req: Request, env: Env) => {
  try {
    const url = new URL(req.url);
    const projectKey = url.searchParams.get("project_key");
    const funnelSlug = url.searchParams.get("funnel_slug");
    const startDate = url.searchParams.get("start_date");
    const endDate = url.searchParams.get("end_date");
    const accountId = url.searchParams.get("account_id");
    const stepId = url.searchParams.get("step_id");
    const limit = url.searchParams.get("limit") || "100";
    const offset = url.searchParams.get("offset") || "0";

    if (!projectKey || !funnelSlug || !startDate || !endDate) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required parameters: project_key, funnel_slug, start_date, end_date",
        }),
        {
          status: 400,
        },
      );
    }

    const encodedProjectKey = encodeURIComponent(projectKey);
    const encodedFunnelSlug = encodeURIComponent(funnelSlug);
    const encodedStartDate = encodeURIComponent(startDate);
    const encodedEndDate = encodeURIComponent(endDate);
    const accountIdParam = accountId
      ? `&account_id=${encodeURIComponent(accountId)}`
      : "";
    const stepIdParam = stepId ? `&step_id=${encodeURIComponent(stepId)}` : "";

    const tinybirdUrl = `${env.TINYBIRD_BASE_URL}/pipes/funnel_dropoff_details.json?token=${env.TINYBIRD_READ_TOKEN}&project_key=${encodedProjectKey}&funnel_slug=${encodedFunnelSlug}&start_date=${encodedStartDate}&end_date=${encodedEndDate}&limit=${limit}&offset=${offset}${accountIdParam}${stepIdParam}`;
    const response = await fetch(tinybirdUrl);
    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching funnel dropoff details:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
});

router.get("/query/account_health_score", async (req: Request, env: Env) => {
  try {
    const url = new URL(req.url);
    const projectKey = url.searchParams.get("project_key");
    const startDate = url.searchParams.get("start_date");
    const endDate = url.searchParams.get("end_date");
    const accountId = url.searchParams.get("account_id");
    const riskTier = url.searchParams.get("risk_tier");
    const sortBy = url.searchParams.get("sort_by");
    const sortOrder = url.searchParams.get("sort_order");
    const limit = url.searchParams.get("limit");
    const offset = url.searchParams.get("offset");

    if (!projectKey || !startDate || !endDate) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required parameters: project_key, start_date, end_date",
        }),
        {
          status: 400,
        },
      );
    }

    const params = new URLSearchParams({
      token: env.TINYBIRD_READ_TOKEN,
      project_key: projectKey,
      start_date: startDate,
      end_date: endDate,
    });

    if (accountId) params.append("account_id", accountId);
    if (riskTier) params.append("risk_tier", riskTier);
    if (sortBy) params.append("sort_by", sortBy);
    if (sortOrder) params.append("sort_order", sortOrder);
    if (limit) params.append("limit", limit);
    if (offset) params.append("offset", offset);

    const tinybirdUrl = `${env.TINYBIRD_BASE_URL}/pipes/account_health_score.json?${params.toString()}`;
    const response = await fetch(tinybirdUrl);
    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching account health score:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
});

router.get("/query/account_health_overview", async (req: Request, env: Env) => {
  try {
    const url = new URL(req.url);
    const projectKey = url.searchParams.get("project_key");
    const startDate = url.searchParams.get("start_date");
    const endDate = url.searchParams.get("end_date");

    if (!projectKey || !startDate || !endDate) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required parameters: project_key, start_date, end_date",
        }),
        {
          status: 400,
        },
      );
    }

    const encodedProjectKey = encodeURIComponent(projectKey);
    const encodedStartDate = encodeURIComponent(startDate);
    const encodedEndDate = encodeURIComponent(endDate);

    const tinybirdUrl = `${env.TINYBIRD_BASE_URL}/pipes/account_health_overview.json?token=${env.TINYBIRD_READ_TOKEN}&project_key=${encodedProjectKey}&start_date=${encodedStartDate}&end_date=${encodedEndDate}`;
    const response = await fetch(tinybirdUrl);
    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching account health overview:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
});

export default router;

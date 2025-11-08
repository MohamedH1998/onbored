export const getFunnelStepMetricsFromWorker = async (
  slug: string,
  projectKey: string,
  from: string,
  to: string,
) => {
  try {
    const params = new URLSearchParams({
      funnel_slug: slug,
      project_key: projectKey,
      start_date: from,
      end_date: to,
    });

    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_INGESTION_WORKER_URL}/query/funnel_step_metrics?${params.toString()}`,
    );

    if (!resp.ok) {
      const error = await resp.json();
      throw new Error(error.error);
    }

    const data = await resp.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching funnel step metrics:", error);
  }
};

export const getFlowSummaryByFunnelFromWorker = async (
  slug: string,
  projectKey: string,
  from: string,
  to: string,
) => {
  try {
    const params = new URLSearchParams({
      funnel_slug: slug,
      project_key: projectKey,
      start_date: from,
      end_date: to,
    });

    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_INGESTION_WORKER_URL}/query/flow_summary_by_funnel?${params.toString()}`,
    );

    if (!resp.ok) {
      const error = await resp.json();
      throw new Error(error.error);
    }

    const data = await resp.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching flow summary by funnel:", error);
  }
};

export const getFunnelLastStepDropoffsFromWorker = async (
  slug: string,
  projectKey: string,
  from: string,
  to: string,
) => {
  try {
    const params = new URLSearchParams({
      funnel_slug: slug,
      project_key: projectKey,
      start_date: from,
      end_date: to,
    });

    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_INGESTION_WORKER_URL}/query/funnel_last_step_dropoffs?${params.toString()}`,
    );

    if (!resp.ok) {
      const error = await resp.json();
      throw new Error(error.error);
    }

    const data = await resp.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching flow summary by funnel:", error);
  }
};

export const getFunnelDropoffsByStepFromWorker = async (
  slug: string,
  projectKey: string,
  from: string,
  to: string,
  stepId: string,
) => {
  try {
    const params = new URLSearchParams({
      funnel_slug: slug,
      project_key: projectKey,
      start_date: from,
      end_date: to,
      step_id: stepId,
    });

    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_INGESTION_WORKER_URL}/query/funnel_dropoffs_by_step?${params.toString()}`,
    );

    if (!resp.ok) {
      const error = await resp.json();
      throw new Error(error.error);
    }

    const data = await resp.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching funnel dropoffs by step:", error);
  }
};

export const getSessionReplayFromWorker = async (
  sessionId: string,
  projectKey: string,
) => {
  try {
    const params = new URLSearchParams({
      session_id: sessionId,
      project_key: projectKey,
    });

    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_INGESTION_WORKER_URL}/query/session_replay?${params.toString()}`,
    );

    if (!resp.ok) {
      const error = await resp.json();
      throw new Error(error.error);
    }

    const data = await resp.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching session replay:", error);
  }
};

export const getAccountFunnelSummaryFromWorker = async (
  funnelSlug: string,
  projectKey: string,
  startDate: string,
  endDate: string,
  accountId?: string,
) => {
  try {
    const params = new URLSearchParams({
      funnel_slug: funnelSlug,
      project_key: projectKey,
      start_date: startDate,
      end_date: endDate,
    });

    if (accountId) {
      params.append("account_id", accountId);
    }

    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_INGESTION_WORKER_URL}/query/account_funnel_summary?${params.toString()}`,
    );

    if (!resp.ok) {
      const error = await resp.json();
      throw new Error(error.error);
    }

    const data = await resp.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching account funnel summary:", error);
    return [];
  }
};

export const getAccountEngagementTrendFromWorker = async (
  projectKey: string,
  accountId?: string,
  startDate?: string,
  endDate?: string,
) => {
  try {
    const params = new URLSearchParams({
      project_key: projectKey,
    });

    if (accountId) {
      params.append("account_id", accountId);
    }
    if (startDate) {
      params.append("start_date", startDate);
    }
    if (endDate) {
      params.append("end_date", endDate);
    }

    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_INGESTION_WORKER_URL}/query/account_engagement_trend?${params.toString()}`,
    );

    if (!resp.ok) {
      const error = await resp.json();
      throw new Error(error.error);
    }

    const data = await resp.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching account engagement trend:", error);
    return [];
  }
};

export const getFunnelDropoffDetailsFromWorker = async (
  projectKey: string,
  funnelSlug: string,
  startDate: string,
  endDate: string,
  options?: {
    accountId?: string;
    stepId?: string;
    limit?: number;
    offset?: number;
  },
) => {
  try {
    const params = new URLSearchParams({
      project_key: projectKey,
      funnel_slug: funnelSlug,
      start_date: startDate,
      end_date: endDate,
    });

    if (options?.accountId) {
      params.append("account_id", options.accountId);
    }
    if (options?.stepId) {
      params.append("step_id", options.stepId);
    }
    if (options?.limit) {
      params.append("limit", options.limit.toString());
    }
    if (options?.offset) {
      params.append("offset", options.offset.toString());
    }

    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_INGESTION_WORKER_URL}/query/funnel_dropoff_details?${params.toString()}`,
    );

    if (!resp.ok) {
      const error = await resp.json();
      throw new Error(error.error);
    }

    const data = await resp.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching funnel dropoff details:", error);
    return [];
  }
};

export const getAccountHealthScoreFromWorker = async (
  projectKey: string,
  startDate: string,
  endDate: string,
  options?: {
    accountId?: string;
    riskTier?: string;
    sortBy?: string;
    sortOrder?: string;
    limit?: number;
    offset?: number;
  },
) => {
  try {
    const params = new URLSearchParams({
      project_key: projectKey,
      start_date: startDate,
      end_date: endDate,
    });

    if (options?.accountId) {
      params.append("account_id", options.accountId);
    }
    if (options?.riskTier) {
      params.append("risk_tier", options.riskTier);
    }
    if (options?.sortBy) {
      params.append("sort_by", options.sortBy);
    }
    if (options?.sortOrder) {
      params.append("sort_order", options.sortOrder);
    }
    if (options?.limit !== undefined) {
      params.append("limit", options.limit.toString());
    }
    if (options?.offset !== undefined) {
      params.append("offset", options.offset.toString());
    }

    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_INGESTION_WORKER_URL}/query/account_health_score?${params.toString()}`,
    );

    if (!resp.ok) {
      const error = await resp.json();
      throw new Error(error.error);
    }

    const data = await resp.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching account health score:", error);
    return [];
  }
};

export const getAccountHealthOverviewFromWorker = async (
  projectKey: string,
  startDate: string,
  endDate: string,
) => {
  try {
    const params = new URLSearchParams({
      project_key: projectKey,
      start_date: startDate,
      end_date: endDate,
    });

    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_INGESTION_WORKER_URL}/query/account_health_overview?${params.toString()}`,
    );

    if (!resp.ok) {
      const error = await resp.json();
      throw new Error(error.error);
    }

    const data = await resp.json();
    return data.data?.[0] || null;
  } catch (error) {
    console.error("Error fetching account health overview:", error);
    return null;
  }
};

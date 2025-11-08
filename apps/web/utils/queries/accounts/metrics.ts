"use server";

import { hasProjectAccessWithEnvironment } from "@/utils/auth-helpers";
import { db } from "@repo/database";
import {
  getAccountFunnelSummaryFromWorker,
  getAccountEngagementTrendFromWorker,
  getFunnelDropoffDetailsFromWorker,
} from "@/lib/analytics/client";

export interface AccountMetricsParams {
  projectId: string;
  funnelId: string;
  from: string;
  to: string;
  accountId?: string;
  planFilter?: string;
  conversionFilter?: string;
  pageSize?: number;
  cursor?: string;
  searchQuery?: string;
}

export interface AccountSummary {
  account_id: string;
  funnel_slug: string;
  flows_started: number;
  flows_completed: number;
  conversion_rate_pct: number;
  avg_completion_seconds: number;
  max_concurrent_users: number;
  first_flow_started_at: string;
  last_flow_activity_at: string;
}

export interface AccountEngagement {
  account_id: string;
  date: string;
  event_count: number;
  active_users: number;
  session_count: number;
  flows_started: number;
  flows_completed: number;
}

export async function getFunnelMetricsForAccount(params: AccountMetricsParams) {
  try {
    const { projectId, funnelId, from, to, pageSize = 10, accountId } = params;

    // Validate auth and get environment
    const authResult = await hasProjectAccessWithEnvironment(projectId);
    if (!authResult.success) {
      return {
        success: false,
        error: authResult.error,
        data: undefined,
      };
    }

    const { apiKey } = authResult.data;

    const funnel = await db.funnel.findFirst({
      where: { projectId, id: funnelId },
      select: { slug: true },
      orderBy: { createdAt: "asc" },
    });

    if (!funnel) {
      return {
        success: false,
        error: "No funnels found for this project",
      };
    }

    // Fetch account funnel summary from Tinybird
    const accountSummaries = await getAccountFunnelSummaryFromWorker(
      funnel.slug,
      apiKey.token,
      from,
      to,
      accountId,
    );

    // console.log("accountSummaries", accountSummaries);

    if (!accountSummaries || accountSummaries.length === 0) {
      return {
        success: true,
        data: [],
        count: 0,
        hasMore: false,
      };
    }

    // Apply filters
    let filteredData = accountSummaries;

    if (params.conversionFilter) {
      switch (params.conversionFilter) {
        case "critical":
          filteredData = filteredData.filter(
            (account: AccountSummary) => account.conversion_rate_pct < 25,
          );
          break;
        case "at_risk":
          filteredData = filteredData.filter(
            (account: AccountSummary) => account.conversion_rate_pct < 50,
          );
          break;
        case "healthy":
          filteredData = filteredData.filter(
            (account: AccountSummary) => account.conversion_rate_pct > 70,
          );
          break;
      }
    }

    // Filter by search query (searches in account_id)
    if (params.searchQuery) {
      const searchLower = params.searchQuery.toLowerCase();
      filteredData = filteredData.filter((account: AccountSummary) =>
        account.account_id.toLowerCase().includes(searchLower),
      );
    }

    // console.log(`filteredData`, filteredData)

    // Implement offset-based pagination
    const offset = params.cursor ? parseInt(params.cursor, 10) : 0;
    const paginatedData = filteredData.slice(offset, offset + pageSize);
    const hasMore = offset + pageSize < filteredData.length;

    return {
      success: true,
      data: paginatedData,
      count: filteredData.length,
      hasMore,
      nextCursor: hasMore ? (offset + pageSize).toString() : null,
    };
  } catch (error: any) {
    console.error("Error fetching account metrics:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch account metrics",
    };
  }
}

export async function getAccountEngagementTrends(params: {
  projectId: string;
  accountIds: string[];
  from?: string;
  to?: string;
}) {
  try {
    const { projectId, accountIds, from, to } = params;

    // Validate auth and get environment
    const authResult = await hasProjectAccessWithEnvironment(projectId);
    if (!authResult.success) {
      return {
        success: false,
        error: authResult.error,
        data: undefined,
      };
    }

    const { apiKey } = authResult.data;

    // Fetch engagement trends for all accounts
    const engagementPromises = accountIds.map((accountId) =>
      getAccountEngagementTrendFromWorker(apiKey.token, accountId, from, to),
    );

    const engagementResults = await Promise.all(engagementPromises);

    // Combine results into a map by account_id
    const engagementMap: Record<string, AccountEngagement[]> = {};
    engagementResults.forEach((result, index) => {
      if (result && result.length > 0) {
        engagementMap[accountIds[index]] = result;
      }
    });

    return {
      success: true,
      data: engagementMap,
    };
  } catch (error: any) {
    console.error("Error fetching account engagement trends:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch account engagement trends",
    };
  }
}

export interface DropoffDetail {
  account_id: string;
  user_id: string;
  session_id: string;
  flow_id: string;
  dropped_at_step: string;
  flow_started_at: string;
  last_event_at: string;
  time_to_dropoff_seconds: number;
  hours_since_dropoff: number;
}

export async function getAccountDropoffDetails(params: {
  projectId: string;
  accountId: string;
  from: string;
  to: string;
  funnelSlug?: string;
  stepId?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    const {
      projectId,
      accountId,
      from,
      to,
      funnelSlug,
      stepId,
      limit,
      offset,
    } = params;

    // Validate auth and get environment
    const authResult = await hasProjectAccessWithEnvironment(projectId);
    if (!authResult.success) {
      return {
        success: false,
        error: authResult.error,
        data: undefined,
      };
    }

    const { apiKey } = authResult.data;

    // Get default funnel if not specified
    let targetFunnelId = funnelSlug;
    if (!targetFunnelId) {
      const defaultFunnel = await db.funnel.findFirst({
        where: { projectId },
        select: { slug: true },
        orderBy: { createdAt: "asc" },
      });

      if (!defaultFunnel) {
        return {
          success: false,
          error: "No funnels found for this project",
        };
      }

      targetFunnelId = defaultFunnel.slug;
    }

    // Fetch dropoff details from Tinybird
    const dropoffDetails = await getFunnelDropoffDetailsFromWorker(
      apiKey.token,
      targetFunnelId,
      from,
      to,
      {
        accountId,
        stepId,
        limit,
        offset,
      },
    );

    return {
      success: true,
      data: dropoffDetails as DropoffDetail[],
      funnelSlug: targetFunnelId,
    };
  } catch (error: any) {
    console.error("Error fetching account dropoff details:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch account dropoff details",
    };
  }
}

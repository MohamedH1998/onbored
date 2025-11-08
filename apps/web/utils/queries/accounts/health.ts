"use server";

import {
  getAccountHealthScoreFromWorker,
  getAccountHealthOverviewFromWorker,
} from "@/lib/analytics/client";
import type { AccountHealthScore, AccountHealthOverview } from "@/typings";
import { hasProjectAccessWithEnvironment } from "@/utils/auth-helpers";

interface GetAccountHealthScoresParams {
  projectId: string;
  startDate: string;
  endDate: string;
  accountId?: string;
  riskTierFilter?: "critical" | "at_risk" | "healthy" | "all";
  page?: number;
  pageSize?: number;
  sortBy?: "health_score" | "last_activity_at";
  sortOrder?: "asc" | "desc";
}

export async function getAccountHealthScores(
  params: GetAccountHealthScoresParams,
) {
  try {
    const {
      projectId,
      startDate,
      endDate,
      accountId,
      riskTierFilter = "all",
      page = 1,
      pageSize = 50,
      sortBy = "health_score",
      sortOrder = "asc",
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

    // Format dates for Tinybird (YYYY-MM-DD HH:mm:ss.SSS format, no 'Z')
    const formattedStartDate = startDate.replace("T", " ").replace("Z", "");
    const formattedEndDate = endDate.replace("T", " ").replace("Z", "");

    const offset = (page - 1) * pageSize;

    const healthScores = (await getAccountHealthScoreFromWorker(
      apiKey.token,
      formattedStartDate,
      formattedEndDate,
      {
        accountId,
        riskTier: riskTierFilter,
        sortBy,
        sortOrder,
        limit: pageSize + 1,
        offset,
      },
    )) as AccountHealthScore[];

    if (!healthScores || healthScores.length === 0) {
      return {
        success: true,
        data: [],
        count: 0,
        hasMore: false,
      };
    }

    const hasMore = healthScores.length > pageSize;
    const data = hasMore ? healthScores.slice(0, pageSize) : healthScores;

    return {
      success: true,
      data,
      count: data.length,
      hasMore,
    };
  } catch (error) {
    console.error("Error fetching account health scores:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: undefined,
    };
  }
}

interface GetAccountHealthOverviewParams {
  projectId: string;
  startDate: string;
  endDate: string;
}

export async function getAccountHealthOverview(
  params: GetAccountHealthOverviewParams,
) {
  try {
    const { projectId, startDate, endDate } = params;

    // Validate auth and get environment
    const authResult = await hasProjectAccessWithEnvironment(projectId);
    if (!authResult.success) {
      return {
        success: false,
        error: authResult.error,
        data: null,
      };
    }

    const { apiKey } = authResult.data;

    // Format dates for Tinybird (YYYY-MM-DD HH:mm:ss.SSS format, no 'Z')
    const formattedStartDate = startDate.replace("T", " ").replace("Z", "");
    const formattedEndDate = endDate.replace("T", " ").replace("Z", "");

    // Fetch overview from Tinybird
    const overview = (await getAccountHealthOverviewFromWorker(
      apiKey.token,
      formattedStartDate,
      formattedEndDate,
    )) as AccountHealthOverview | null;

    return {
      success: true,
      data: overview,
    };
  } catch (error) {
    console.error("Error fetching account health overview:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}

interface GetSingleAccountHealthParams {
  projectId: string;
  accountId: string;
  startDate: string;
  endDate: string;
}

export async function getSingleAccountHealth(
  params: GetSingleAccountHealthParams,
) {
  try {
    const { projectId, accountId, startDate, endDate } = params;

    // Validate auth and get environment
    const authResult = await hasProjectAccessWithEnvironment(projectId);
    if (!authResult.success) {
      return {
        success: false,
        error: authResult.error,
        data: null,
      };
    }

    const { apiKey } = authResult.data;

    // Format dates for Tinybird (YYYY-MM-DD HH:mm:ss.SSS format, no 'Z')
    const formattedStartDate = startDate.replace("T", " ").replace("Z", "");
    const formattedEndDate = endDate.replace("T", " ").replace("Z", "");

    // Fetch health score for specific account
    const healthScores = (await getAccountHealthScoreFromWorker(
      apiKey.token,
      formattedStartDate,
      formattedEndDate,
      {
        accountId,
      },
    )) as AccountHealthScore[];

    if (!healthScores || healthScores.length === 0) {
      return {
        success: true,
        data: null,
      };
    }

    return {
      success: true,
      data: healthScores[0],
    };
  } catch (error) {
    console.error("Error fetching single account health:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}

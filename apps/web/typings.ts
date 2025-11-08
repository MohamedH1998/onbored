import { UniqueIdentifier } from "@dnd-kit/core";

export type DNDType = {
  [key: string]: {
    items: {
      id: UniqueIdentifier;
      title: string;
    }[];
    title: string;
  };
};

export interface SessionJourney {
  sessionId: string;
  userId: string;
  steps: string[];
}

export interface Stat {
  title: string;
  value: number | string;
  iconKey: string;
}

export interface StepData {
  name: string;
  views: number;
  skips: number;
  completions: number;
}

export type ActionableInsight = {
  title: string;
  subtitle: string;
  key: string;
  category: "dropoff" | "slow" | "low-engagement";
  severity: "low" | "medium" | "high";
  stepName: string;
  actionPrompt: string;
  suggestedActions?: string[];
  metrics?: string;
  context?: {
    dropOffRate: number;
    avgDuration: number;
    views: number;
    completions: number;
  };
  generatedAt: string;
  score: number;
  replayQuery?: Record<string, any>;
};

export interface DataTableFilterField<TData> {
  id: keyof TData;
  label: string;
  placeholder?: string;
  options?: {
    label: string;
    value: string;
  }[];
}

export type FunnelDropoff = {
  flow_id: string;
  session_id: string;
  funnel_slug: string;
  step_id: string;
  duration_seconds: number;
  flow_started_at: string;
  flow_ended_at: string;
};

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

export interface AccountTableRow {
  account_id: string;
  avg_completion_seconds: number;
  plan?: string;
  mrr?: number;
  health_score?: number;
  trend_direction?: TrendDirection;
  last_activity?: string;
  risk_tier?: AccountRiskTier;
}

export const ACCOUNT_CONVERSION_THRESHOLDS = {
  HEALTHY: 70,
  AT_RISK: 40,
  CRITICAL: 25,
} as const;

// Account Health Score Types
export type AccountRiskTier = "critical" | "at_risk" | "healthy";
export type TrendDirection = "up" | "down" | "flat";

export interface AccountHealthScore {
  account_id: string;
  account_name?: string;

  // Final health score (0-100)
  health_score: number;
  risk_tier: AccountRiskTier;
  trend_direction: TrendDirection;

  // Raw components
  cross_funnel_completion_rate: number;
  engagement_velocity_pct: number;
  days_since_last_activity: number;
  failed_session_ratio_pct: number;

  // Weighted score components
  completion_score: number;
  velocity_score: number;
  recency_score: number;
  session_success_score: number;

  // Metadata
  total_funnels: number;
  total_sessions: number;
  last_activity_at: string;
  primary_blocker: string | null;
}

export interface AccountHealthOverview {
  critical_count: number;
  at_risk_count: number;
  healthy_count: number;
  total_accounts: number;
}

export const HEALTH_SCORE_THRESHOLDS = {
  HEALTHY: 71,
  AT_RISK: 41,
  CRITICAL: 0,
} as const;

export const RISK_TIER_CONFIG = {
  healthy: {
    label: "Healthy",
    description: "71-100 health score",
    color: "text-green-600 bg-green-50",
    badgeColor: "bg-green-100 text-green-800",
  },
  at_risk: {
    label: "At Risk",
    description: "41-70 health score",
    color: "text-yellow-600 bg-yellow-50",
    badgeColor: "bg-yellow-100 text-yellow-800",
  },
  critical: {
    label: "Critical",
    description: "0-40 health score",
    color: "text-red-600 bg-red-50",
    badgeColor: "bg-red-100 text-red-800",
  },
} as const;

export const TREND_DIRECTION_CONFIG = {
  up: {
    label: "↑ Improving",
    color: "text-green-600",
    icon: "arrow-up",
  },
  down: {
    label: "↓ Declining",
    color: "text-red-600",
    icon: "arrow-down",
  },
  flat: {
    label: "→ Stable",
    color: "text-gray-600",
    icon: "arrow-right",
  },
} as const;

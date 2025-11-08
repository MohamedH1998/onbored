"use server";

import { AccountHealthScore } from "@/typings";
import { Duration, formatDuration } from "date-fns";
import { DropoffDetail } from "../queries/accounts/metrics";

export const getAccountActionableInsights = async ({
  healthScore,
  dropoffDetails,
  projectId,
}: {
  healthScore: AccountHealthScore;
  dropoffDetails: DropoffDetail[];
  projectId: string;
}) => {
  const primaryDropoff = dropoffDetails.find(
    (d) => d.dropped_at_step === healthScore.primary_blocker,
  );
  const insights = [];

  if (primaryDropoff && primaryDropoff.time_to_dropoff_seconds < 30) {
    insights.push({
      priority: "high" as const,
      category: "friction" as const,
      title: 'Fix "' + healthScore.primary_blocker + '" step UX',
      description:
        "User dropped off in " +
        primaryDropoff.time_to_dropoff_seconds +
        "s. " +
        ". This instant dropoff indicates UX friction.",
      action: "Review step design and validation",
      link: primaryDropoff.session_id
        ? `/project/${projectId}/session-replay/${primaryDropoff.session_id}`
        : undefined,
    });
  }

  if (
    healthScore.days_since_last_activity >= 2 &&
    healthScore.days_since_last_activity < 7
  ) {
    insights.push({
      priority: "high" as const,
      category: "engagement" as const,
      title: "Re-engage within next 24-48 hours",
      description:
        "Account is " +
        healthScore.days_since_last_activity +
        " days inactive. Re-engagement success rate drops significantly after 7 days of inactivity.",
      action: "Send targeted email or in-app notification",
    });
  }

  if (
    healthScore.total_funnels === 1 &&
    healthScore.cross_funnel_completion_rate === 0
  ) {
    insights.push({
      priority: "medium" as const,
      category: "strategic" as const,
      title: "Increase funnel exposure",
      description:
        "Account only has 1 funnel tracked with 0% completion. Consider onboarding them to additional flows to improve activation.",
      action: "Identify and enable relevant funnels for this account",
    });
  }

  if (dropoffDetails.length > 0 && dropoffDetails[0].session_id) {
    insights.push({
      priority: "medium" as const,
      category: "friction" as const,
      title: "Watch session replay for context",
      description:
        "Review the " +
        formatDuration(dropoffDetails[0].time_to_dropoff_seconds as Duration) +
        " session to understand exact friction points and user behavior.",
      action: "Watch Session Replay",
      link: `/project/${projectId}/session-replay/${dropoffDetails[0].session_id}`,
    });
  }

  if (primaryDropoff && primaryDropoff.time_to_dropoff_seconds < 20) {
    insights.push({
      priority: "low" as const,
      category: "friction" as const,
      title: "Test mobile experience",
      description:
        "Ultra-fast dropoffs often indicate mobile responsiveness issues or unclear mobile UI.",
      action: "Test step on mobile devices and check responsive design",
    });
  }

  return insights;
};

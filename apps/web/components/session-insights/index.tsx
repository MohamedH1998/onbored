"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SessionInsight } from "@repo/database";
import {
  AlertTriangle,
  Clock,
  MousePointer,
  TrendingDown,
  TrendingUp,
  Activity,
  Zap,
  Target,
  AlertCircle,
  Info,
  Lightbulb,
  User,
  Shield,
  TargetIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/utils/helpers";
import { Separator } from "../ui/separator";

interface SessionInsightsProps {
  sessionInsight: SessionInsight | undefined;
}

const getInsightIcon = (insightType: string) => {
  switch (insightType) {
    case "RAGE_CLICKS":
    case "DEAD_CLICKS":
    case "ERROR_CLICKS":
      return <AlertTriangle className="w-4 h-4" />;
    case "LONG_IDLE":
    case "HESITATION":
      return <Clock className="w-4 h-4" />;
    case "MISCLICK":
    case "REPEATED_CLICKS":
      return <MousePointer className="w-4 h-4" />;
    case "FAST_EXIT":
    case "FORM_ABANDON":
    case "FLOW_INCOMPLETE":
      return <TrendingDown className="w-4 h-4" />;
    case "COMPLETION":
    case "KEY_ACTION_SUCCESS":
      return <TrendingUp className="w-4 h-4" />;
    case "JS_ERROR":
    case "NETWORK_FAILURE":
      return <AlertCircle className="w-4 h-4" />;
    case "SLOW_PAGE_LOAD":
      return <Zap className="w-4 h-4" />;
    case "BUTTON_DISABLED":
    case "CTA_NOT_FOUND":
      return <Target className="w-4 h-4" />;
    default:
      return <Activity className="w-4 h-4" />;
  }
};

const getInsightCategory = (insightType: string) => {
  if (insightType.includes("CLICK")) return "Interaction";
  if (insightType.includes("TIME") || insightType.includes("IDLE"))
    return "Timing";
  if (insightType.includes("ERROR") || insightType.includes("FAILURE"))
    return "Technical";
  if (insightType.includes("FORM") || insightType.includes("FLOW"))
    return "Flow";
  if (insightType.includes("COMPLETION") || insightType.includes("SUCCESS"))
    return "Success";
  if (insightType.includes("DESIGN") || insightType.includes("INTENT"))
    return "UX Analysis";
  return "Other";
};

export default function SessionInsights({
  sessionInsight,
}: SessionInsightsProps) {
  if (!sessionInsight) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Session Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No insights available for this session</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Parse behavior summary into structured timeline
  const parseBehaviorTimeline = (summary: string) => {
    return summary
      .split(/[.;]/)
      .map((point) => point.trim())
      .filter((point) => point.length > 0)
      .slice(0, 6); // Limit for visual clarity
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.8)
      return { level: "High", color: "text-emerald-600", bg: "bg-emerald-50" };
    if (confidence >= 0.6)
      return { level: "Medium", color: "text-amber-600", bg: "bg-amber-50" };
    return { level: "Low", color: "text-red-600", bg: "bg-red-50" };
  };

  const getSeverityLevel = (severity: string) => {
    switch (severity) {
      case "high":
        return { color: "text-red-600", bg: "bg-red-50", dot: "bg-red-500" };
      case "medium":
        return {
          color: "text-amber-600",
          bg: "bg-amber-50",
          dot: "bg-amber-500",
        };
      default:
        return { color: "text-blue-600", bg: "bg-blue-50", dot: "bg-blue-500" };
    }
  };

  const severity = getSeverityLevel(sessionInsight.severity || "medium");
  const category = getInsightCategory(sessionInsight.insightType);
  const confidence = getConfidenceLevel(sessionInsight.confidence);
  const severityLevel = sessionInsight.severity || "medium";

  const behaviorTimeline = sessionInsight.userBehaviorSummary
    ? parseBehaviorTimeline(sessionInsight.userBehaviorSummary)
    : [];

  return (
    <Card className="h-full pt-0">
      <div className="flex items-center justify-between bg-muted gap-2 py-2 px-4 bg-muted border-b rounded-t-xl">
        <div className="">
          <h4 className="text-sm font-medium">Session Insights</h4>
          <p className="text-xs text-muted-foreground">
            Session insight details
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {sessionInsight.insightType.replace(/_/g, " ")}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        </div>
      </div>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-background rounded-lg p-3 border">
            <div className="flex items-center gap-2 mb-2">
              <TargetIcon className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                Impact
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn("w-3 h-3 rounded-full", severity.dot)} />
              <span className="text-sm font-medium capitalize">
                {severityLevel}
              </span>
            </div>
          </div>

          <div className="bg-background rounded-lg p-3 border">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                Confidence
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
                  confidence.color.replace("text-", "bg-"),
                )}
              />
              <span className="text-sm font-medium">
                {Math.round(sessionInsight.confidence * 100)}%
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${severity.color} ${severity.bg}`}>
              {getInsightIcon(sessionInsight.insightType)}
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-sm leading-relaxed">
                {sessionInsight.description}
              </p>
            </div>
          </div>
        </div>

        {sessionInsight.actionableRecommendation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Recommendation
              </span>
            </div>
            <p className="text-sm leading-relaxed text-blue-800">
              {sessionInsight.actionableRecommendation}
            </p>
          </div>
        )}

        <Separator />

        {/* Timestamps */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            Timeline
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Session:</span>
              <span className="font-medium">
                {formatDistanceToNow(new Date(sessionInsight.timestamp), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Insight Created:</span>
              <span className="font-medium">
                {formatDistanceToNow(new Date(sessionInsight.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

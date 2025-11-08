import { getSessionReplay } from "@/utils/queries/session-replay";
import React from "react";
import SessionReplay from "@/components/session-replay";
import SessionInsights from "@/components/session-insights";
import { processSessionRecording } from "@/utils/actions/insights/session-replay";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import ClientLink from "@/components/client-link";

function transformReplayData(rows: any) {
  return rows
    .map(([_, raw]: [any, any]) => {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{
    sessionReplayId: string;
    projectId: string;
    funnelId: string;
    step: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { sessionReplayId, projectId, funnelId } = await params;
  const { step } = await searchParams;

  const { success, data } = await getSessionReplay({
    id: sessionReplayId,
    projectId: projectId,
    funnelId: funnelId,
  });

  if (!success) {
    return <div>Error</div>;
  }

  const transformedData = transformReplayData(data.replay_events);

  const sessionReplayInsights = await processSessionRecording({
    sessionId: sessionReplayId,
    projectId,
    sessionReplay: transformedData,
    funnelId,
  });

  return (
    <div className="flex flex-col px-14 py-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <ClientLink
            href={`/project/${projectId}/funnel/${funnelId}/insights?step=${step}`}
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </ClientLink>
        </Button>
      </div>
      <div>
        <div className="flex justify-between items-center gap-8 py-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Insights</h1>
            <p className="text-muted-foreground mt-1">
              Session insights for {sessionReplayId.slice(0, 12)}...
            </p>
          </div>
        </div>
        <div className="min-h-screen bg-background">
          <div className="container flex gap-6">
            <div className="w-full">
              <SessionInsights
                sessionInsight={sessionReplayInsights?.data || undefined}
              />
            </div>

            <div className="w-full">
              <SessionReplay events={transformedData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

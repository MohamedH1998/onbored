import React, { Suspense } from "react";
import ProjectContainer from "@/containers/project";
import { Button } from "@/components/ui/button";
import ClientLink from "@/components/client-link";
import { Plus } from "lucide-react";
import ProjectContainerSkeleton from "@/containers/project/skeleton";

const Page = async ({ params }: { params: Promise<{ projectId: string }> }) => {
  const { projectId } = await params;

  return (
    <div className="flex flex-col gap-8 px-4 md:px-14 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Funnels</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your funnels
          </p>
        </div>
        <Button asChild className="gap-2">
          <ClientLink prefetch href={`/project/${projectId}/funnel/new`}>
            <Plus className="w-4 h-4" />
            Create Funnel
          </ClientLink>
        </Button>
      </div>
      <Suspense fallback={<ProjectContainerSkeleton />}>
        <ProjectContainer projectId={projectId} />
      </Suspense>
    </div>
  );
};

export default Page;

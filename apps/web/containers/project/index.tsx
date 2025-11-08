import { FileText } from "lucide-react";
import { Files, Link } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import FunnelCard from "@/components/funnel-card";
import React from "react";
import { getProject } from "@/utils/queries/projects";
import { redirect } from "next/navigation";

const ProjectContainer = async ({ projectId }: { projectId: string }) => {
  const { success, data: project } = await getProject({
    projectId,
    opts: { funnels: true },
  });

  if (!success || !project) {
    redirect("/");
  }

  return (
    <div className="flex flex-col lg:flex-row justify-start items-center gap-4">
      {project.funnels.length > 0 ? (
        project.funnels.map((funnel, i) => (
          <FunnelCard key={i} funnel={funnel} />
        ))
      ) : (
        <div className="flex justify-center items-center w-full h-full">
          <EmptyState
            title="No Funnels"
            description="You can create a new funnel to get started."
            icons={[FileText, Link, Files]}
            redirectUrl={`/project/${projectId}/funnel/new`}
            redirectLabel="Create Funnel"
          />
        </div>
      )}
    </div>
  );
};

export default ProjectContainer;

import React from "react";
import { getProject } from "@/utils/queries/projects";
import { redirect } from "next/navigation";
import FunnelCreationForm from "@/containers/create-funnel";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getFunnel } from "@/utils/queries/funnels";

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { projectId } = await params;
  const { funnelId } = await searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { data: project } = await getProject({ projectId });

  if (!project) {
    redirect("/");
  }

  const funnel = funnelId
    ? await getFunnel({ funnelId: funnelId as string, projectId })
    : null;

  return (
    <div className="flex flex-col gap-8 px-4 md:px-14 py-8">
      <FunnelCreationForm
        projectId={projectId}
        workspaceMemberId={session?.user?.id || ""}
        funnel={funnel?.data}
      />
    </div>
  );
};

export default Page;

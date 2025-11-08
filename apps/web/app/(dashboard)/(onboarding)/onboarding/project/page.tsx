import { Project } from "@/containers/onboarding/project";
import { cookies } from "next/headers";
import React from "react";

const Page = async () => {
  const workspaceId = (await cookies()).get("workspaceId")?.value;
  return <Project workspaceId={workspaceId} />;
};

export default Page;

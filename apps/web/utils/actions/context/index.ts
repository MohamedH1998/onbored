"use server";

import { headers } from "next/headers";
import { db } from "@repo/database";
import { auth } from "@/lib/auth";
import { cache } from "react";
import { getCookieContext } from "@/utils/cookie-helpers";
import { hasWorkspaceAccess } from "@/utils/auth-helpers";

const EMPTY_CONTEXT = {
  workspace: null,
  project: null,
  environment: null,
  hasWorkspace: false,
  hasProject: false,
  hasEnvironment: false,
} as const;

export const getContextFromCookies = cache(async function () {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return EMPTY_CONTEXT;
  }

  const { workspaceId, projectId, mode } = await getCookieContext();

  if (!workspaceId || !projectId) {
    return EMPTY_CONTEXT;
  }

  const assumedMode = mode || "prod";

  const hasAccess = await hasWorkspaceAccess(session.user.id, workspaceId);

  if (!hasAccess.success) {
    return EMPTY_CONTEXT;
  }

  const workspace = await db.workspace.findFirst({
    where: {
      id: workspaceId,
      members: { some: { userId: session.user.id } },
    },
    include: {
      projects: {
        where: {
          id: projectId,
          workspaceId: workspaceId,
        },
        include: {
          Environment: { where: { slug: assumedMode } },
        },
      },
    },
  });

  const project = workspace?.projects[0];
  const env = project?.Environment[0];

  if (!workspace || !project || !env) {
    return EMPTY_CONTEXT;
  }

  return {
    workspace,
    project,
    environment: env,
    hasWorkspace: true,
    hasProject: true,
    hasEnvironment: true,
  };
});

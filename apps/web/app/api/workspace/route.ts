import { auth } from "@/lib/auth";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@repo/database";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { workspaceId } = await request.json();

  const workspace = await db.workspace.findFirst({
    where: {
      id: workspaceId,
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  if (!workspace) {
    return NextResponse.json(
      { error: "Workspace not found or access denied" },
      { status: 404 },
    );
  }

  const cookieStore = await cookies();
  cookieStore.set("workspaceId", workspaceId);

  const projects = await db.project.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "asc" },
  });

  const firstProject = projects.length > 0 ? projects[0] : null;

  if (firstProject) {
    cookieStore.set("projectId", firstProject.id);
  }

  return NextResponse.json({
    workspace,
    project: firstProject,
    projects,
  });
}

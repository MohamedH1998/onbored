import { auth } from "@/lib/auth";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@repo/database";

// GET: Fetch active project (for PPR dashboard hydration)
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = await cookies();
  const projectId = cookieStore.get("projectId")?.value;

  let project;
  if (projectId) {
    project = await db.project.findFirst({
      where: {
        id: projectId,
        workspace: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
      include: {
        workspace: true,
        funnels: true,
        Environment: true,
      },
    });
  }

  if (!project) {
    project = await db.project.findFirst({
      where: {
        workspace: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
      include: {
        workspace: true,
        funnels: true,
        Environment: true,
      },
    });
  }

  if (!project) {
    return NextResponse.json({ error: "No project found" }, { status: 404 });
  }

  cookieStore.set("projectId", project.id, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  const activeEnvironment =
    project.Environment.find(
      (env) => env.slug === cookieStore.get("mode")?.value,
    ) ??
    project.Environment.find((env) => env.slug === "prod") ??
    project.Environment[0];

  return NextResponse.json({
    project,
    workspace: project.workspace,
    environment: activeEnvironment,
  });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await request.json();

  const project = await db.project.findFirst({
    where: {
      id: projectId,
      workspace: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },
    include: {
      workspace: true,
      funnels: true,
      Environment: true,
    },
  });

  if (!project) {
    return NextResponse.json(
      { error: "Project not found or access denied" },
      { status: 404 },
    );
  }

  const cookieStore = await cookies();
  cookieStore.set("projectId", projectId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.json({
    project,
    workspace: project.workspace,
  });
}

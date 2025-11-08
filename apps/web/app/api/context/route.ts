import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@repo/database";
import { auth } from "@/lib/auth";
import { getFirstWorkspace } from "@/utils/queries/workspaces";

const setCookie = (res: NextResponse, key: string, value: string) => {
  res.cookies.set(key, value, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
  });
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const next = url.searchParams.get("next") ?? "/";

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", url.origin));
  }

  const workspaceResult = await getFirstWorkspace();
  if (!workspaceResult.success) {
    return NextResponse.redirect(new URL("/sign-in", url.origin));
  }
  const workspace = workspaceResult.data;

  if (!workspace) {
    const res = NextResponse.redirect(
      new URL("/onboarding/welcome", url.origin),
    );
    res.cookies.delete("workspaceId");
    res.cookies.delete("projectId");
    res.cookies.delete("mode");
    return res;
  }

  const project = workspace.projects[0];

  if (!project) {
    const res = NextResponse.redirect(
      new URL("/onboarding/project", url.origin),
    );
    setCookie(res, "workspaceId", workspace.id);
    res.cookies.delete("projectId");
    res.cookies.delete("mode");
    return res;
  }

  const env =
    project.Environment.find((e) => e.slug === "prod") ||
    project.Environment[0];

  const res = NextResponse.redirect(new URL(next, url.origin));

  if (!env) {
    // @TODO: Create env, set cookie and next
    return res;
  }

  setCookie(res, "workspaceId", workspace.id);
  setCookie(res, "projectId", project.id);
  if (env) setCookie(res, "mode", env.slug);

  return res;
}

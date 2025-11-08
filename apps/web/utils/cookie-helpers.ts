"use server";

import { cookies } from "next/headers";

/**
 * Standard cookie options for context cookies
 */
const COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

/**
 * Context cookie names
 */
const CONTEXT_COOKIES = {
  WORKSPACE_ID: "workspaceId",
  PROJECT_ID: "projectId",
  MODE: "mode",
} as const;

/**
 * Get all context values from cookies
 */
export async function getCookieContext() {
  const cookieStore = await cookies();

  return {
    workspaceId: cookieStore.get(CONTEXT_COOKIES.WORKSPACE_ID)?.value,
    projectId: cookieStore.get(CONTEXT_COOKIES.PROJECT_ID)?.value,
    mode: cookieStore.get(CONTEXT_COOKIES.MODE)?.value,
  };
}

/**
 * Set workspace ID cookie
 */
export async function setWorkspaceCookie(workspaceId: string) {
  const cookieStore = await cookies();
  cookieStore.set(CONTEXT_COOKIES.WORKSPACE_ID, workspaceId, COOKIE_OPTIONS);
}

/**
 * Set project ID cookie
 */
export async function setProjectCookie(projectId: string) {
  const cookieStore = await cookies();
  cookieStore.set(CONTEXT_COOKIES.PROJECT_ID, projectId, COOKIE_OPTIONS);
}

/**
 * Set mode (environment) cookie
 */
export async function setModeCookie(mode: string) {
  const cookieStore = await cookies();
  cookieStore.set(CONTEXT_COOKIES.MODE, mode, COOKIE_OPTIONS);
}

/**
 * Set all context cookies at once
 */
export async function setContextCookies(context: {
  workspaceId?: string;
  projectId?: string;
  mode?: string;
}) {
  const cookieStore = await cookies();

  if (context.workspaceId) {
    cookieStore.set(
      CONTEXT_COOKIES.WORKSPACE_ID,
      context.workspaceId,
      COOKIE_OPTIONS,
    );
  }

  if (context.projectId) {
    cookieStore.set(
      CONTEXT_COOKIES.PROJECT_ID,
      context.projectId,
      COOKIE_OPTIONS,
    );
  }

  if (context.mode) {
    cookieStore.set(CONTEXT_COOKIES.MODE, context.mode, COOKIE_OPTIONS);
  }
}

/**
 * Delete workspace cookie
 */
export async function deleteWorkspaceCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(CONTEXT_COOKIES.WORKSPACE_ID);
}

/**
 * Delete project cookie
 */
export async function deleteProjectCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(CONTEXT_COOKIES.PROJECT_ID);
}

/**
 * Delete mode cookie
 */
export async function deleteModeCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(CONTEXT_COOKIES.MODE);
}

/**
 * Delete all context cookies
 */
export async function deleteContextCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(CONTEXT_COOKIES.WORKSPACE_ID);
  cookieStore.delete(CONTEXT_COOKIES.PROJECT_ID);
  cookieStore.delete(CONTEXT_COOKIES.MODE);
}

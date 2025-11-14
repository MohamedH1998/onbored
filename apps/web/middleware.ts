import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  const sessionToken =
    request.cookies.get("__Secure-better-auth.session_token") ||
    request.cookies.get("better-auth.session_token");

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (pathname.startsWith("/onboarding")) {
    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
  }

  const workspaceId = request.cookies.get("workspaceId")?.value;
  const projectId = request.cookies.get("projectId")?.value;
  const mode = request.cookies.get("mode")?.value;

  if (!workspaceId || !projectId || !mode) {
    const next = encodeURIComponent(pathname + request.nextUrl.search);

    return NextResponse.redirect(
      new URL(`/api/context?next=${next}`, request.url)
    );
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static files (svg, png, jpg, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.ico).*)",
  ],
};

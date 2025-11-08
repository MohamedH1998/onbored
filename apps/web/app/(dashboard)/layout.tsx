import { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ContextProvider } from "@/components/context-provider";
import { getContextFromCookies } from "@/utils/actions/context";
import { auth } from "@/lib/auth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isOnboarding = pathname.startsWith("/onboarding");

  if (isOnboarding) {
    return <>{children}</>;
  }

  const context = await getContextFromCookies();

  if (!context.hasWorkspace || !context.hasProject) {
    const here = encodeURIComponent("/");
    redirect(`/api/context?next=${here}`);
  }

  return <ContextProvider initialContext={context}>{children}</ContextProvider>;
}

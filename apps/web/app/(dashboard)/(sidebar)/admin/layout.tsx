import { auth } from "@/lib/auth/server";
import { isSuperAdmin } from "@/utils/auth-helpers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const isAdmin = await isSuperAdmin(session.user.id);
  if (!isAdmin) {
    redirect("/");
  }

  return <>{children}</>;
}

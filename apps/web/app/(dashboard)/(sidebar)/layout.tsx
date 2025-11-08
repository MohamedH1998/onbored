import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Metadata } from "next";
import Header from "@/components/header";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getOnboardingProgress } from "@/utils/queries/onboarding";
import { getNextStep } from "@/utils/helpers";
import { getCurrentUser } from "@/utils/auth-helpers";

export const metadata: Metadata = {
  title: "Project",
  description: "View your project",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userResult = await getCurrentUser();

  if (!userResult.success) {
    redirect("/sign-in");
  }

  const onboardingProgress = await getOnboardingProgress();

  if (!onboardingProgress.data?.completed) {
    const nextStep = getNextStep(onboardingProgress.data?.lastCompletedStep);
    redirect(`/onboarding/${nextStep}`);
  }

  return (
    <div className="grid min-h-screen w-full bg-sidebar">
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full max-w-screen overflow-x-hidden  bg-sidebar min-h-screen md:pt-2">
          <main className="w-full max-w-screen overflow-x-hidden md:rounded-tl-xl bg-white h-full md:border-t-1 md:border-l-1 border-sidebar-border">
            <Header />
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

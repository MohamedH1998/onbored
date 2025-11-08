import React from "react";
import { redirect } from "next/navigation";

import { getOnboardingProgress } from "@/utils/queries/onboarding";
import OnboardingNav from "@/components/onboarding-nav";
import OnBoredProvider from "@/components/onbored-provider";

import "rrweb-player/dist/style.css";
import { BackgroundRippleEffect } from "@/components/backgrounds/ripple-effect";
import { getCurrentUser } from "@/utils/auth-helpers";
import { getActiveWorkspace } from "@/utils/queries/workspaces";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const onboardingProgress = await getOnboardingProgress();

  if (onboardingProgress.data?.completed) {
    redirect("/");
  }

  const [workspaceResult, userResult] = await Promise.all([
    getActiveWorkspace(),
    getCurrentUser(),
  ]);

  if (!userResult.success) {
    redirect("/sign-in");
  }
  const workspace = workspaceResult?.success ? workspaceResult.data : null;

  return (
    <OnBoredProvider user={userResult.data} workspace={workspace}>
      <div className="relative flex flex-col gap-4 space-y-10 max-h-screen">
        <BackgroundRippleEffect rows={20} cols={28} cellSize={45} />
        <OnboardingNav />
        <div className="max-w-md mx-auto z-10">{children}</div>
      </div>
    </OnBoredProvider>
  );
}

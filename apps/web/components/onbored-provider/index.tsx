"use client";

import { User } from "better-auth";
import { OnboredProvider } from "onbored-js/react";
import { Workspace } from "@repo/database";

const Provider = ({
  children,
  user,
  workspace,
}: {
  children: React.ReactNode;
  user: User;
  workspace: Workspace | null | undefined;
}) => {
  return (
    <OnboredProvider
      config={{
        projectKey: process.env.NEXT_PUBLIC_ONBORED_PROJECT_KEY!!,
        apiHost: process.env.NEXT_PUBLIC_ONBORED_INGESTION_API_HOST!,
        debug: true,
        userId: user.id,
        userTraits: {
          email: user.email,
          name: user.name,
        },
        accountId: workspace?.id,
        accountTraits: {
          name: workspace?.name || "",
          // @TODO - When we have a billing system, we can use the plan from the workspace
          plan: "pro",
          mrr: 1500,
          lifecycle: "active",
        },
        sessionReplay: {
          apiHost: process.env.NEXT_PUBLIC_ONBORED_INGESTION_API_HOST!,
          flushInterval: 10_000,
          maskInputs: true,
          blockElements: [],
          onError: (err: Error) =>
            console.error("[Onbored - Session Recorder]", err),
        },
      }}
    >
      {children}
    </OnboredProvider>
  );
};

export default Provider;

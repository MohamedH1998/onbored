import React from "react";

import ApiKeyManagement from "./api-key-management";
import Guide from "./guide";
import { getApiKeys } from "@/utils/queries/api-keys";

export default async function Installation({
  projectId,
}: {
  projectId: string;
}) {
  const { data: apiKeys, success } = await getApiKeys({ projectId });

  if (!success) {
    return <div>Error fetching API keys</div>;
  }
  const codeBlocks = {
    install: "npm install onbored-js",
    setup: `import { onbored } from 'onbored-js';

// Initialize with your project key
onbored.init({
  projectKey: '${apiKeys?.[0]?.token || "pk_live_1234567890abcdef"}',
  userId: 'user_123',
  userMetadata: {
    plan: 'premium',
    role: 'admin'
  },
  debug: true,
});`,
    track: `// Start tracking a flow
onbored.flow('onboarding', {
  source: 'signup'
});

// Track a completed step
onbored.step('profile-setup', {
  slug: 'onboarding',
  method: 'email',
  duration: 45
});

// Track a skipped step
onbored.skip('team-invite', {
  slug: 'onboarding',
  reason: 'solo_user'
});

// Complete the flow
onbored.complete({
  slug: 'onboarding',
  totalSteps: 5,
  duration: 420
});`,
    react: `import { OnboredProvider, useFunnel } from 'onbored-js';

function App() {
  return (
    <OnboredProvider
      config={{
        projectKey: '${apiKeys?.[0]?.token || "pk_live_1234567890abcdef"}',
        userId: 'user_123',
        userMetadata: { plan: 'premium' },
        debug: true
      }}
    >
      <OnboardingFlow />
    </OnboredProvider>
  );
}

function OnboardingFlow() {
  const { step, skip, complete } = useFunnel('onboarding');

  return (
    <div>
      <button onClick={() => step('profile-setup')}>
        Complete Profile
      </button>
      <button onClick={() => skip('team-invite')}>
        Skip Team Setup
      </button>
      <button onClick={() => complete()}>
        Finish Onboarding
      </button>
    </div>
  );
}`,
    nextjs: `// app/providers.tsx
'use client';

import { OnboredProvider } from 'onbored-js/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OnboredProvider
      config={{
        projectKey: "${apiKeys?.[0]?.token || "pk_live_1234567890abcdef"}",
        userId: "user_123",
        userMetadata: { plan: 'premium' },
        debug: true
      }}
    >
      {children}
    </OnboredProvider>
  );
}

// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}`,
  };

  return (
    <div className="flex flex-col gap-8">
      <ApiKeyManagement projectId={projectId} />
      <Guide codeBlocks={codeBlocks} />
    </div>
  );
}

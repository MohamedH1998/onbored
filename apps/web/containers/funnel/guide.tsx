"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/utils/helpers";
import {
  Cog,
  Code,
  BookOpen,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import CodeWindow from "@/components/code-window";
import { Funnel, FunnelStep } from "@repo/database";

const FunnelGuide = ({
  funnel,
}: {
  funnel: Funnel & { steps: FunnelStep[] };
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const funnelSteps =
    funnel.steps.length >= 3
      ? funnel.steps
      : [
          {
            key: "step-key-1",
            stepName: "Step 1",
          },
          {
            key: "step-key-2",
            stepName: "Step 2",
          },
          {
            key: "step-key-3",
            stepName: "Step 3",
          },
        ];

  const codeExamples = {
    basic: `import { useFunnel } from 'onbored-js';

function ${funnel.slug.charAt(0).toUpperCase() + funnel.slug.slice(1).replace(/-/g, "")}Flow() {
  const { step, skip, complete } = useFunnel('${funnel.slug}');

  return (
    <div>
      <button onClick={() => step('${funnelSteps[0].key}')}>
        ${funnelSteps[0].stepName || "Get Started"}
      </button>
      <button onClick={() => skip('${funnelSteps[1].key}')}>
        Skip ${funnelSteps[1].stepName || "Step"}
      </button>
      <button onClick={() => complete()}>
        Complete ${funnel.slug}
      </button>
    </div>
  );
}`,
    withMetadata: `import { useFunnel } from 'onbored-js/react';

const { step, skip, complete } = useFunnel('${funnel.slug}');

// Track step with rich metadata
step('${funnelSteps[0].key}', {
  method: 'email',
  duration: 45,
  fieldsCompleted: ['name', 'email', 'company']
});

// Track skipped steps with context
skip('${funnelSteps[1].key}', {
  reason: 'solo_user',
  alternative: 'manual-invite-later'
});

// Complete with summary metrics
complete({
  totalSteps: ${funnelSteps.length},
  duration: 420,
  completionRate: 1.0
});`,
    layout: `// app/providers.tsx
'use client';

import { OnboredProvider } from 'onbored-js/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OnboredProvider
      config={{
        projectKey: "pk_live_1234567890abcdef",
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
    bestPractices: `// ✅ Use specific step keys from your funnel
step('${funnelSteps[0].key}');

// ❌ Avoid generic or vague names
step('step1');
step('next');

// ✅ Add meaningful metadata for analytics
step('${funnelSteps[0].key}', {
  amount: 99.99,
  currency: 'USD',
  paymentMethod: 'credit-card',
  itemsCount: 3
});

// ✅ Track skip reasons to understand drop-offs
skip('${funnelSteps[1].key}', {
  reason: 'already_subscribed',
  userSegment: 'returning-customer'
});

// ✅ Include conversion metrics in completion
complete({
  totalSteps: ${funnelSteps.length},
  revenue: 299.99,
  duration: 420,
  completionRate: 1.0
});`,
  };

  return (
    <div>
      <Sheet>
        <SheetTrigger
          className={cn(
            buttonVariants({ variant: "outline" }),
            "group relative border border-gray-200 bg-white hover:bg-gray-50 p-0 overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300",
          )}
        >
          <div className="hover:rotate-90 transition-transform duration-500 p-3">
            <Cog className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
          </div>
        </SheetTrigger>
        <SheetContent className="lg:max-w-2xl p-0 overflow-hidden">
          {/* Clean header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <SheetHeader className="text-left gap-0">
              <SheetTitle className="flex items-center text-xl font-semibold text-gray-900">
                Funnel Integration Guide
              </SheetTitle>
              <SheetDescription className="text-gray-600 text-sm mt-2">
                Learn how to integrate and track funnel steps using the
                useFunnel hook
              </SheetDescription>
            </SheetHeader>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
            <div className="space-y-8">
              {/* Quick Start Section */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white rounded-lg border border-gray-200">
                    <Zap className="w-4 h-4 text-gray-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Quick Start
                  </h3>
                </div>
                <p className="text-gray-600 mb-4 text-sm">
                  Get up and running with funnel tracking in just a few steps
                </p>
                <CodeWindow
                  onCopy={() => copyToClipboard(codeExamples.layout, "layout")}
                  label="Setup"
                  showLineNumbers={true}
                  className="mb-4"
                >
                  {codeExamples.layout}
                </CodeWindow>
              </div>

              {/* Basic Usage Section */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <BookOpen className="w-4 h-4 text-gray-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Basic Usage
                  </h3>
                </div>
                <p className="text-gray-600 mb-4 text-sm">
                  Learn the fundamental patterns for tracking user progress
                  through your funnel
                </p>
                <CodeWindow
                  onCopy={() => copyToClipboard(codeExamples.basic, "basic")}
                  label="MyFunnel.jsx"
                  showLineNumbers={true}
                >
                  {codeExamples.basic}
                </CodeWindow>
              </div>

              {/* Advanced Usage Section */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Sparkles className="w-4 h-4 text-gray-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Advanced Usage
                  </h3>
                </div>
                <p className="text-gray-600 mb-4 text-sm">
                  Leverage metadata to gain deeper insights into user behavior
                </p>
                <CodeWindow
                  onCopy={() =>
                    copyToClipboard(codeExamples.withMetadata, "metadata")
                  }
                  label="advanced-tracking.js"
                  showLineNumbers={true}
                >
                  {codeExamples.withMetadata}
                </CodeWindow>
              </div>

              {/* Best Practices Section */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-gray-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Best Practices
                  </h3>
                </div>
                <p className="text-gray-600 mb-4 text-sm">
                  Follow these guidelines to create meaningful and actionable
                  funnel data
                </p>
                <CodeWindow
                  onCopy={() =>
                    copyToClipboard(codeExamples.bestPractices, "practices")
                  }
                  label="best practices"
                  showLineNumbers={true}
                >
                  {codeExamples.bestPractices}
                </CodeWindow>
              </div>

              {/* Key Concepts Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                    Key Concepts
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="font-medium text-gray-900 text-sm">
                        useFunnel(funnelSlug)
                      </div>
                      <div className="text-gray-600 text-xs mt-1">
                        Initialize tracking for a specific funnel
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="font-medium text-gray-900 text-sm">
                        step(stepName, options?)
                      </div>
                      <div className="text-gray-600 text-xs mt-1">
                        Track when a user completes a step
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="font-medium text-gray-900 text-sm">
                        skip(stepName, options?)
                      </div>
                      <div className="text-gray-600 text-xs mt-1">
                        Track when a user skips a step
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="font-medium text-gray-900 text-sm">
                        complete(options?)
                      </div>
                      <div className="text-gray-600 text-xs mt-1">
                        Mark the entire funnel as completed
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                    Common Use Cases
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="font-medium text-gray-900 text-sm">
                        User Onboarding
                      </div>
                      <div className="text-gray-600 text-xs mt-1">
                        Track new user setup flows
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="font-medium text-gray-900 text-sm">
                        E-commerce Checkout
                      </div>
                      <div className="text-gray-600 text-xs mt-1">
                        Monitor purchase conversion
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="font-medium text-gray-900 text-sm">
                        Feature Adoption
                      </div>
                      <div className="text-gray-600 text-xs mt-1">
                        Track feature usage sequences
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="font-medium text-gray-900 text-sm">
                        Account Setup
                      </div>
                      <div className="text-gray-600 text-xs mt-1">
                        Monitor profile completion
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtle footer */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <h4 className="font-medium text-gray-900 mb-2">
                  Ready to get started?
                </h4>
                <p className="text-gray-600 text-sm">
                  Copy the code examples above and integrate funnel tracking
                  into your app today
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f9fafb;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default FunnelGuide;

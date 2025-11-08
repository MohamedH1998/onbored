"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Code, Package, Terminal } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CodeBlock } from "./codeblock";
import { toast } from "sonner";

const Guide = ({
  codeBlocks,
}: {
  codeBlocks: {
    install: string;
    setup: string;
    track: string;
    react: string;
    nextjs: string;
  };
}) => {
  const [packageManager, setPackageManager] = useState("npm");

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const getInstallCommand = (pm: string) => {
    const commands = {
      npm: "npm install onbored-js",
      yarn: "yarn add onbored-js",
      pnpm: "pnpm add onbored-js",
      bun: "bun add onbored-js",
    };
    return commands[pm as keyof typeof commands] || commands.npm;
  };

  const packageManagers = ["npm", "yarn", "pnpm", "bun"];

  return (
    <div className="space-y-6">
      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Quick Start
          </CardTitle>
          <CardDescription>
            Install and configure our SDK in your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Step 1: Install */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <h3 className="font-medium">Install the SDK</h3>
                <Badge variant="secondary" className="text-xs">
                  <Terminal className="h-3 w-3 mr-1" />
                  CLI
                </Badge>
              </div>
              <div className="rounded-lg">
                <div className="flex items-center justify-between">
                  <Tabs
                    className="w-full gap-0"
                    value={packageManager}
                    onValueChange={setPackageManager}
                  >
                    <div className="flex items-center justify-between py-1 pr-4">
                      <TabsList>
                        {packageManagers.map((pm) => (
                          <TabsTrigger key={pm} value={pm} className="text-xs">
                            {pm}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>
                    <Separator className="w-full" />
                    {packageManagers.map((pm) => (
                      <TabsContent key={pm} value={pm}>
                        <div className="flex items-center justify-between w-full">
                          <CodeBlock
                            children={getInstallCommand(pm)}
                            lang="bash"
                            onCopy={() =>
                              copyToClipboard(
                                getInstallCommand(pm),
                                "Install command",
                              )
                            }
                          />
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </div>
            </div>

            {/* Step 2: Initialize */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <h3 className="font-medium">Initialize the SDK</h3>
                <Badge variant="secondary" className="text-xs">
                  <Code className="h-3 w-3 mr-1" />
                  TS
                </Badge>
              </div>

              <CodeBlock
                className="w-full"
                children={codeBlocks.setup}
                lang="typescript"
                label="setup.ts"
                onCopy={() => copyToClipboard(codeBlocks.setup, "Setup code")}
              />
            </div>

            {/* Step 3: Track Events */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <h3 className="font-medium">Track Events</h3>
                <Badge variant="secondary" className="text-xs">
                  <Code className="h-3 w-3 mr-1" />
                  TS
                </Badge>
              </div>
              <CodeBlock
                className="w-full"
                label="track.ts"
                children={codeBlocks.track}
                lang="typescript"
                onCopy={() =>
                  copyToClipboard(codeBlocks.track, "Tracking code")
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next.js Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Next.js Integration
          </CardTitle>
          <CardDescription>
            Set up the SDK with Next.js App Router
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock
            className="w-full"
            label="Next.js Setup"
            children={codeBlocks.nextjs}
            lang="typescript"
            onCopy={() => copyToClipboard(codeBlocks.nextjs, "Next.js setup")}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Guide;

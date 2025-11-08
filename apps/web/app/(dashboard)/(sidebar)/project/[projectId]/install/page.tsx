import React, { Suspense } from "react";
import Installation from "@/containers/installation";

const Page = async ({ params }: { params: Promise<{ projectId: string }> }) => {
  const { projectId } = await params;

  return (
    <div className="flex flex-col gap-8 px-4 md:px-14 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Installation
          </h1>
          <p className="text-muted-foreground mt-1">
            Install and configure our SDK in your application
          </p>
        </div>
      </div>
      <Suspense fallback={<div className="" />}>
        <Installation projectId={projectId} />
      </Suspense>
    </div>
  );
};

export default Page;

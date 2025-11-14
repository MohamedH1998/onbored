import DashboardContainer from "@/containers/dashboard";
import { Suspense } from "react";
import { accountTableSchema } from "@/containers/dashboard/types";
import type { AccountTableSchema } from "@/containers/dashboard/types";
import AccountSkeleton from "@/containers/dashboard/skeleton";
import { Calendar } from "@/components/calendar";
import { cookies } from "next/headers";

export type { AccountTableSchema };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const filters = accountTableSchema.parse(await searchParams);

  const projectIdPromise = cookies().then(
    (cookies) => cookies.get("projectId")?.value ?? ""
  );

  return (
    <div className="flex flex-col gap-8 px-4 md:px-14 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Account Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor account-level funnel performance and engagement trends
          </p>
        </div>
        <Calendar />
      </div>
      <div>
        <Suspense fallback={<AccountSkeleton />}>
          <DashboardContainer
            projectId={projectIdPromise}
            searchParams={filters}
          />
        </Suspense>
      </div>
    </div>
  );
}

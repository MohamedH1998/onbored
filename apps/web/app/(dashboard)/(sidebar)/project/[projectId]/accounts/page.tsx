import React, { Suspense } from "react";
import { parseFilter, parseValidatedDateRange } from "@/utils/helpers";
import { AccountTableSchema } from "@/containers/dashboard/types";
import AccountsContainer from "@/containers/accounts";
import AccountCardSkeleton from "@/components/account-card/skeleton";

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<Partial<AccountTableSchema>>;
}) => {
  const { projectId } = await params;
  const { filter, pageSize, dateRange } = await searchParams;
  const filters = parseFilter(filter);

  const { from, to } = parseValidatedDateRange(dateRange);

  return (
    <div className="flex flex-col gap-8 px-4 md:px-14 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your accounts
          </p>
        </div>
      </div>
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, index) => (
              <AccountCardSkeleton key={index} />
            ))}
          </div>
        }
      >
        <AccountsContainer
          projectId={projectId}
          filters={filters}
          pageSize={pageSize}
          from={from}
          to={to}
        />
      </Suspense>
    </div>
  );
};

export default Page;

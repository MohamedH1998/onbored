import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import InfoCardSkeleton from "@/components/info-card/skeleton";
import React from "react";

const AccountSkeleton = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <InfoCardSkeleton key={index} description={true} />
        ))}
      </div>
      <DataTableSkeleton columnCount={4} rowCount={5} withPagination={false} />
    </div>
  );
};

export default AccountSkeleton;

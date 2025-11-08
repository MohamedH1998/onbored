import React from "react";
import { Skeleton } from "../ui/skeleton";

const InfoCardSkeleton = ({
  cta,
  badge,
  description,
}: {
  cta?: boolean;
  badge?: boolean;
  description?: boolean;
}) => {
  return (
    <div className="w-full max-w-lg md:max-w-[300px] border rounded-lg p-1 flex flex-col gap-2 relative bg-gray-100 border-gray-300">
      <div className="rounded-t-sm p-3 bg-white flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="w-5/12 h-4 rounded-full" />
          {badge && <Skeleton className="w-3/12 h-4 rounded-full" />}
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-9/12 h-9 rounded-lg" />
        </div>
        {description && <Skeleton className="w-7/12 h-4 rounded-lg" />}
      </div>
      <div className="p-2 pt-0 px-3 flex items-center justify-between">
        <Skeleton className="w-7/12 h-4 rounded-lg" />
        {cta && <Skeleton className="w-4/12 h-8 rounded-lg" />}
      </div>
    </div>
  );
};

export default InfoCardSkeleton;

import InfoCardSkeleton from "@/components/info-card/skeleton";
import React from "react";

const ProjectContainerSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-start items-center gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <InfoCardSkeleton
          key={index}
          cta={true}
          badge={true}
          description={false}
        />
      ))}
    </div>
  );
};

export default ProjectContainerSkeleton;

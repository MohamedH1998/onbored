import React from "react";
import { cn } from "@/lib/utils";

const Section = ({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => {
  return (
    <div
      className={cn(
        "relative border-x border-stone-300 max-w-7xl mx-auto ",
        className,
      )}
      id={id}
    >
      {children}
    </div>
  );
};

export default Section;

"use client";

import Link from "next/link";
import React from "react";

const ClientLink = ({
  href,
  children,
  className,
  prefetch,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
}) => {
  return (
    <Link href={href} className={className} prefetch={prefetch}>
      {children}
    </Link>
  );
};

export default ClientLink;

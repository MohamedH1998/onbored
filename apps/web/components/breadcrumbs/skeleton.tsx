import { Fragment } from "react";
import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "../ui/skeleton";

export function SkeletonBreadcrumbs({
  items,
}: {
  items: { title?: string; href?: string; current?: boolean }[];
}) {
  return (
    <BreadcrumbComponent>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbItem className={item.current ? "text-primary" : ""}>
              <BreadcrumbLink
                href={item.current ? undefined : item.href}
                className={item.current ? "text-primary" : ""}
              >
                <Skeleton className="w-20 h-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbComponent>
  );
}

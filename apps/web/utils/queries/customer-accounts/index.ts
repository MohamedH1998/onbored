"use server";

import { BaseTableSchema } from "@/components/data-table/base-table-schema";
import { parseFilter } from "@/utils/helpers";
import { db } from "@repo/database";

type SortableFields = {
  name: "asc" | "desc";
  plan: "asc" | "desc";
  mrr: "asc" | "desc";
  lifecycle: "asc" | "desc";
  createdAt: "asc" | "desc";
  updatedAt: "asc" | "desc";
};

export const sortBy = async (
  sort: string,
): Promise<Partial<SortableFields>> => {
  if (!sort) return {};

  const direction = sort.startsWith("-") ? "desc" : "asc";
  const field = sort.replace("-", "");

  switch (field) {
    case "name":
      return { name: direction };
    case "plan":
      return { plan: direction };
    case "mrr":
      return { mrr: direction };
    case "lifecycle":
      return { lifecycle: direction };
    case "createdAt":
      return { createdAt: direction };
    case "updatedAt":
      return { updatedAt: direction };
    default:
      return {};
  }
};

export const getCustomerAccountsByProjectId = async ({
  projectId,
  input,
}: {
  projectId: string;
  input: BaseTableSchema;
}) => {
  try {
    const parsedFilters = parseFilter(input.filter);
    const sortOptions = input.sort
      ? await sortBy(input.sort)
      : { createdAt: "desc" };
    const [customerAccounts, count] = await Promise.all([
      db.customerAccount.findMany({
        where: {
          projects: {
            some: {
              projectId,
            },
          },
          ...(input.search && {
            name: {
              contains: input.search,
              mode: "insensitive",
            },
          }),
          ...parsedFilters.map((filter) => ({
            [filter.id]: {
              in: filter.value,
            },
          })),
        },
        include: {
          projects: {
            where: {
              projectId,
            },
            select: {
              id: true,
              traits: true,
            },
          },
          memberships: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
        skip: input.pageIndex * input.pageSize,
        take: input.pageSize,
        orderBy: sortOptions as any,
      }),
      db.customerAccount.count({
        where: {
          projects: {
            some: {
              projectId,
            },
          },
        },
      }),
    ]);

    return { success: true, data: customerAccounts, count, error: undefined };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to fetch customer accounts",
      data: undefined,
    };
  }
};

export const getCustomerAccountsByAccountIds = async ({
  accountIds,
  projectId,
}: {
  accountIds: string[];
  projectId: string;
}) => {
  const customerAccounts = await db.customerAccount.findMany({
    where: {
      accountId: { in: accountIds },
      workspace: {
        projects: {
          some: { id: projectId },
        },
      },
    },
  });
  return customerAccounts;
};

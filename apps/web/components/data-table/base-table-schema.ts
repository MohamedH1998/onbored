import z from "zod";

export const baseTableSchema = z.object({
  pageIndex: z.coerce.number().optional().default(0),
  pageSize: z.coerce.number().optional().default(10),
  sort: z.string().optional(),
  search: z.string().optional(),
  filter: z.string().optional(),
  dateRange: z.string().optional(),
});

export type BaseTableSchema = z.infer<typeof baseTableSchema>;

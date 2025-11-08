import { z } from "zod";
import { baseTableSchema } from "@/components/data-table/base-table-schema";

export const accountTableSchema = baseTableSchema.extend({
  cursor: z.string().optional(),
});

export type AccountTableSchema = z.infer<typeof accountTableSchema>;

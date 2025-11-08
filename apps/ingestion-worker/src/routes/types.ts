import { z } from "zod";

export const eventPayloadSchema = z.object({
  id: z.string(),
  event_type: z.string(),
  flow_id: z.string().optional(),
  funnel_slug: z.string().optional(),
  step_id: z.string().optional(),
  metadata: z.record(z.any()).default({}),
  session_id: z.string().uuid(),
  timestamp: z.string(),
  project_key: z.string(),
  user_id: z.string(),
  user_traits: z.record(z.any()).default({}),
  url: z.string().url(),
  account_id: z.optional(z.nullable(z.string())),
  account_traits: z.record(z.any()).default({}),
  referrer: z.string().url().optional(),
});

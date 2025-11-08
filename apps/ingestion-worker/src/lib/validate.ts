import { z } from "zod";

const sessionUploadSchema = z.object({
  sessionId: z.string(),
  projectKey: z.string(),
  timestamp: z.number(),
  event: z.any().transform((val) => (Array.isArray(val) ? val : [val])),
});

export function parseReplayPayload(raw: string) {
  const lines = raw.trim().split("\n");

  const parsed =
    lines.length === 1
      ? JSON.parse(raw)
      : {
          ...JSON.parse(lines[0]),
          event: lines.map((line) => JSON.parse(line).event).flat(),
        };

  return sessionUploadSchema.parse(parsed);
}

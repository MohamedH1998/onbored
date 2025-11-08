import { Env } from "../worker";

export async function sendToTinybird(
  parsed: {
    projectKey: string;
    sessionId: string;
    timestamp: number;
    event: any[];
  },
  env: Env,
) {
  const ndjson = parsed.event
    .map((e) =>
      JSON.stringify({
        project_key: parsed.projectKey,
        session_id: parsed.sessionId,
        timestamp: parsed.timestamp,
        event_data: e,
      }),
    )
    .join("\n");

  const res = await fetch(
    `${env.TINYBIRD_BASE_URL}/events?name=session_replay_events&wait=true`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.TINYBIRD_WRITE_TOKEN}`,
        "Content-Type": "application/x-ndjson",
      },
      body: ndjson,
    },
  );

  if (!res.ok) {
    const err = await res.text();
    return { ok: false, error: err };
  }

  return { ok: true };
}

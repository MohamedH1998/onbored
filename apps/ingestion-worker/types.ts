export type EventType =
  | string
  | "page_viewed"
  | "flow_started"
  | "flow_completed"
  | "step_viewed"
  | "step_skipped"
  | "step_abandoned"
  | "step_completed";

export interface EventPayload {
  id: string;
  event_type: EventType;
  slug?: string;
  flow_id?: string;
  step_id?: string;
  options: Record<string, any>;
  result?: string;
  traits?: Record<string, any>;
  session_id: string;
  timestamp: string;
  project_key: string;
  url: string;
  referrer?: string;
}

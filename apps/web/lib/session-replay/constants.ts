export const RAGE_CLICK_THRESHOLD_MS = 1000; // 1 second window for rage clicks
export const RAGE_CLICK_COUNT_THRESHOLD = 3; // Minimum clicks to consider rage clicking
export const IDLE_TIME_THRESHOLD_MS = 30000; // 30 seconds of inactivity to consider session end
export const SESSION_END_THRESHOLD_MS = 300000; // 5 minutes to detect session end
export const DEAD_CLICK_DETECTION_WINDOW_MS = 1000; // 1 second window for dead clicks

export const SCROLL_DEPTH_THRESHOLDS = {
  INITIAL: { position: 0, percentage: 10 },
  CONTENT_START: { position: 200, percentage: 30 },
  SIGNIFICANT: { position: 500, percentage: 50 },
  DEEP: { position: 800, percentage: 70 },
  NEAR_BOTTOM: { position: 1200, percentage: 85 },
  BOTTOM: { position: 1600, percentage: 95 },
  MAX: { position: Infinity, percentage: 100 },
} as const;

export const INTERACTIVE_TAGS = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
] as const;
export const INTERACTIVE_ATTRIBUTES = ["onclick", "tabindex", "href"] as const;

export const INTERACTIVE_ATTRIBUTES_WITH_LABEL = [
  "aria-label",
  "placeholder",
  "title",
  "alt",
  "data-testid",
  "name",
  "id",
] as const;

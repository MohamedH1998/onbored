export interface VirtualDomNode {
  id: number;
  type: number;
  tagName?: string;
  attributes: Record<string, any>;
  textContent?: string;
  parentId: number | null;
  childNodes: number[];
  cssSelector?: string;
  htmlContent?: string;
  semanticRole?: string;
}

export interface EnrichedRrwebEvent {
  enrichedData?: {
    htmlContent?: string;
    cssSelector?: string;
    semanticRole?: string;
    interactionDetails?: {
      x: number;
      y: number;
      targetNodeId: number;
    };
  };
}

export interface DerivedMetrics {
  totalSessionDurationMs: number;
  idleTimeMs: number;
  // scrollDepthPercentage: number;
  averageTimeBetweenClicksMs: number | null;
  totalClicks: number;
  formInteractionsCount: number;
  rageClickCount: number;
  deadClickCount: number;
  pageViewCount: number;
}

export interface PageChange {
  timestamp: number;
  fromUrl: string | null;
  toUrl: string;
  title: string | null;
  eventType: "full_snapshot" | "meta_url_change";
}

export interface ParsedRrwebData {
  enrichedEvents: EnrichedRrwebEvent[];
  derivedMetrics: DerivedMetrics;
  pageChanges: PageChange[];
}

export interface ClickSequence {
  targetId: number;
  timestamp: number;
}

export interface MetricsState {
  lastEventTimestamp: number | null;
  lastInteractionTimestamp: number | null;
  totalIdleTimeMs: number;
  // maxScrollDepthPercentage: number;
  clickTimestamps: number[];
  formInteractionsCount: number;
  rageClickCount: number;
  deadClickCount: number;
  lastClickTargetId: number | null;
  currentClickSequence: ClickSequence[];
  currentPageUrl: string | null;
}

export enum SemanticInteractionType {
  CLICK = "CLICK",
  HOVER = "HOVER",
  INPUT = "INPUT",
  SCROLL = "SCROLL",
  RAGE_CLICK = "RAGE_CLICK",
  NAVIGATION = "NAVIGATION",
  LEAVE_PAGE = "LEAVE_PAGE",
}

export type SemanticInteraction = {
  type: SemanticInteractionType;
  label?: string;
  timestamp: number;
  nodeId?: number;
  semanticRole?: string;
  additionalData?: Record<string, any>;
};

export interface ClickTracker {
  nodeId: number;
  timestamps: number[];
  label?: string;
}

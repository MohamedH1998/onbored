import {
  eventWithTime,
  EventType,
  IncrementalSource,
  MouseInteractions,
  inputData,
  scrollData,
  mouseInteractionData,
} from "@rrweb/types";
import { VirtualDomManager } from "./virtual-dom-manager";
import {
  SemanticInteraction,
  ClickTracker,
  SemanticInteractionType,
} from "./types";
import {
  INTERACTIVE_ATTRIBUTES_WITH_LABEL,
  RAGE_CLICK_THRESHOLD_MS,
  RAGE_CLICK_COUNT_THRESHOLD,
  SESSION_END_THRESHOLD_MS,
} from "./constants";

/**
 * Defines the structure of the comprehensive UX session summary.
 */
export interface UXSessionSummary {
  keyActions: string[]; // High-level actions taken by the user
  frictionPoints: string[]; // Identified areas of user struggle or confusion
  sessionDurationMs: number; // Total duration of the session in milliseconds
  totalInteractions: number; // Total number of semantic events
}

/**
 *  parser that handles both semantic interaction transformation and UX analysis
 */
export class SessionParser {
  private virtualDom: VirtualDomManager;
  private clickTrackers: Map<number, ClickTracker>;
  private lastInteractionTimestamp: number;
  private processedInteractions: SemanticInteraction[];

  constructor() {
    this.virtualDom = new VirtualDomManager();
    this.clickTrackers = new Map();
    this.lastInteractionTimestamp = 0;
    this.processedInteractions = [];
  }

  /**
   * Process rrweb events and return comprehensive session analysis
   * @param events - The rrweb events
   * @returns Object containing semantic interactions, UX analysis, and timestamped summary
   */
  public processSession(events: eventWithTime[]): {
    interactions: SemanticInteraction[];
    analysis: UXSessionSummary;
    timestampedSummary: string;
  } {
    // Transform events to semantic interactions
    const interactions = this.transform(events);

    // Generate UX analysis
    const analysis = this.analyzeUX(interactions);

    // Generate timestamped summary
    const timestampedSummary = this.generateTimestampedSummary(interactions);

    return {
      interactions,
      analysis,
      timestampedSummary,
    };
  }

  /**
   * Transform the rrweb events into semantic interactions
   * @param events - The rrweb events
   * @returns The semantic interactions
   */
  public transform(events: eventWithTime[]): SemanticInteraction[] {
    if (!events.length) return [];

    const normalizedEvents = events.map((event) => ({
      ...event,
      timestamp: event.timestamp,
    }));

    const interactions: SemanticInteraction[] = [];

    for (let i = 0; i < normalizedEvents.length; i++) {
      const event = normalizedEvents[i];
      this._updateVirtualDom(event);

      const eventInteractions = this._processEvent(event);
      interactions.push(...eventInteractions);

      this.lastInteractionTimestamp = event.timestamp;
    }

    // Post-processing steps
    const sessionEndInteractions = this._detectSessionEnd(interactions);
    interactions.push(...sessionEndInteractions);

    this._resolveRageClicks(interactions);

    this.processedInteractions = this._finalizeInteractions(interactions);
    return this.processedInteractions;
  }

  /**
   * Analyze semantic interactions and generate UX insights
   * @param interactions - The semantic interactions
   * @returns UX session summary
   */
  public analyzeUX(interactions: SemanticInteraction[]): UXSessionSummary {
    if (interactions.length === 0) {
      return {
        keyActions: [],
        frictionPoints: [],
        sessionDurationMs: 0,
        totalInteractions: 0,
      };
    }

    interactions.sort((a, b) => a.timestamp - b.timestamp);

    const firstTimestamp = interactions[0].timestamp;
    const lastTimestamp = interactions[interactions.length - 1].timestamp;
    const sessionDurationMs = lastTimestamp - firstTimestamp;

    const keyActions = this._extractKeyActions(interactions);
    const frictionPoints = this._identifyFrictionPoints(interactions);

    return {
      keyActions,
      frictionPoints,
      sessionDurationMs,
      totalInteractions: interactions.length,
    };
  }

  /**
   * Generate timestamped summary of interactions
   * @param interactions - The semantic interactions
   * @returns Timestamped summary string
   */
  public generateTimestampedSummary(
    interactions: SemanticInteraction[],
  ): string {
    if (interactions.length === 0) {
      return "No interactions recorded.";
    }

    const lines: string[] = [];
    interactions.sort((a, b) => a.timestamp - b.timestamp);

    for (const interaction of interactions) {
      let line = `t=${interaction.timestamp}ms: `;

      switch (interaction.type) {
        case "NAVIGATION":
          const href = interaction.additionalData?.href || "unknown page";
          line += `Navigated to "${href}"`;
          break;

        case "INPUT":
          const label = interaction.label || "an input field";
          const valueSnippet = interaction.additionalData?.value
            ? `: "${String(interaction.additionalData.value).substring(0, 20)}..."`
            : "";
          line += `Entered text into "${label}"${valueSnippet}`;
          break;

        case "CLICK":
          const clickLabel = interaction.label || "an element";
          line += `Clicked "${clickLabel}" ${interaction.semanticRole ? `(a ${interaction.semanticRole})` : ""}`;
          break;

        case "RAGE_CLICK":
          const rageLabel = interaction.label || "an element";
          const clickCount =
            interaction.additionalData?.clickCount || "multiple";
          line += `Rage clicked "${rageLabel}" ${interaction.semanticRole ? `(a ${interaction.semanticRole})` : ""} (${clickCount} rapid clicks)`;
          break;

        case "SCROLL":
          const scrollDirection =
            interaction.additionalData?.scrollDirection || "unknown direction";
          const scrollDistance = interaction.additionalData?.scrollDistance
            ? ` (${interaction.additionalData.scrollDistance}px)`
            : "";
          line += `Scrolled ${scrollDirection}${scrollDistance}`;
          break;

        case "HOVER":
          const hoverLabel = interaction.label || "an element";
          line += `Hovered over "${hoverLabel}"`;
          break;

        case "LEAVE_PAGE":
          const leaveReason =
            interaction.additionalData?.reason || "unknown reason";
          const idleTime = interaction.additionalData?.idleTime
            ? ` after ${Math.round(interaction.additionalData.idleTime / 1000)}s of inactivity`
            : "";
          line += `Left the page (${leaveReason}${idleTime})`;
          break;

        default:
          line += `Performed ${interaction.type} on "${interaction.label || "an element"}"`;
      }
      lines.push(line);
    }
    return lines.join("\n");
  }

  /**
   * Update the virtual DOM based on the event
   */
  private _updateVirtualDom(event: eventWithTime): void {
    if (event.type === EventType.FullSnapshot && "data" in event) {
      this.virtualDom.buildFromSnapshot(event.data);
    } else if (event.type === EventType.IncrementalSnapshot) {
      const source = event.data.source;
      if (source === IncrementalSource.Mutation) {
        this.virtualDom.applyMutation(event.data as any);
      }
    }
  }

  /**
   * Process a single event and return semantic interactions
   */
  private _processEvent(event: eventWithTime): SemanticInteraction[] {
    switch (event.type) {
      case EventType.Meta:
        return this._processMetaEvent(event);

      case EventType.IncrementalSnapshot:
        return this._processIncrementalSnapshot(event);

      default:
        return [];
    }
  }

  /**
   * Process the meta event
   */
  private _processMetaEvent(event: eventWithTime): SemanticInteraction[] {
    const interactions: SemanticInteraction[] = [];

    if ("href" in (event.data as any)) {
      interactions.push({
        type: SemanticInteractionType.NAVIGATION,
        timestamp: event.timestamp,
        additionalData: {
          href: (event.data as any).href,
        },
      });
    }

    return interactions;
  }

  /**
   * Process the incremental snapshot event
   */
  private _processIncrementalSnapshot(
    event: eventWithTime,
  ): SemanticInteraction[] {
    const interactions: SemanticInteraction[] = [];
    const source = (event.data as any).source;

    switch (source) {
      case IncrementalSource.MouseInteraction:
        const mouseInteractions = this._processMouseInteraction(event);
        interactions.push(...mouseInteractions);
        break;

      case IncrementalSource.Input:
        const inputInteraction = this._processInputEvent(event);
        if (inputInteraction) interactions.push(inputInteraction);
        break;

      case IncrementalSource.Scroll:
        const scrollInteraction = this._processScrollEvent(event);
        if (scrollInteraction) interactions.push(scrollInteraction);
        break;
    }

    return interactions;
  }

  /**
   * Process a mouse interaction event
   */
  private _processMouseInteraction(
    event: eventWithTime,
  ): SemanticInteraction[] {
    const interactions: SemanticInteraction[] = [];
    const mouseEvent = event.data as mouseInteractionData;
    const nodeId = mouseEvent.id;

    const nodeData = this.virtualDom.getEnrichedNodeData(nodeId);
    const label = this._extractLabel(nodeData, nodeId);

    if (mouseEvent.type === MouseInteractions.Click || mouseEvent.type === 0) {
      // Track click for rage click detection
      this._trackClick(nodeId, event.timestamp, label);

      // Add regular click interaction
      interactions.push({
        type: SemanticInteractionType.CLICK,
        label,
        semanticRole: this.virtualDom.getEnrichedNodeData(nodeId)?.semanticRole,
        timestamp: event.timestamp,
        nodeId,
        additionalData: {
          coordinates: { x: mouseEvent.x || 0, y: mouseEvent.y || 0 },
        },
      });
    } else if (mouseEvent.type === 1) {
      // Hover interaction
      interactions.push({
        type: SemanticInteractionType.HOVER,
        label,
        timestamp: event.timestamp,
        nodeId,
        additionalData: {
          coordinates: { x: mouseEvent.x || 0, y: mouseEvent.y || 0 },
        },
      });
    }

    return interactions;
  }

  /**
   * Track a click for rage click detection
   */
  private _trackClick(nodeId: number, timestamp: number, label: string): void {
    if (!this.clickTrackers.has(nodeId)) {
      this.clickTrackers.set(nodeId, { nodeId, timestamps: [], label });
    }
    const tracker = this.clickTrackers.get(nodeId)!;
    tracker.timestamps.push(timestamp);
    tracker.label = label;
  }

  /**
   * Process an input event
   */
  private _processInputEvent(event: eventWithTime): SemanticInteraction | null {
    const inputEvent = event.data as inputData;
    const nodeId = inputEvent.id;

    const nodeData = this.virtualDom.getEnrichedNodeData(nodeId);
    const label = this._extractInputLabel(nodeData, nodeId);

    return {
      type: SemanticInteractionType.INPUT,
      label,
      timestamp: event.timestamp,
      semanticRole: this.virtualDom.getEnrichedNodeData(nodeId)?.semanticRole,
      nodeId,
      additionalData: {
        value: inputEvent.text || undefined,
      },
    };
  }

  /**
   * Extract label for input elements
   */
  private _extractInputLabel(nodeData: any, nodeId: number): string {
    // Extract meaningful label from DOM
    let label = nodeData?.semanticRole;
    if (!label) {
      label = this.virtualDom.resolveNodeLabel?.(nodeId);
    }

    // Extract attributes from htmlContent if available
    if (nodeData?.htmlContent) {
      const htmlContent = nodeData.htmlContent;

      // Extract placeholder attribute
      const placeholderMatch = htmlContent.match(/placeholder="([^"]*)"/);
      if (placeholderMatch) {
        label = placeholderMatch[1] || label;
      }

      // Extract aria-label attribute
      const ariaLabelMatch = htmlContent.match(/aria-label="([^"]*)"/);
      if (ariaLabelMatch) {
        label = ariaLabelMatch[1] || label;
      }

      // Extract name attribute
      const nameMatch = htmlContent.match(/name="([^"]*)"/);
      if (nameMatch) {
        label = nameMatch[1] || label;
      }
    }

    return label || `#${nodeId}`;
  }

  /**
   * Process a scroll event
   */
  private _processScrollEvent(
    event: eventWithTime,
  ): SemanticInteraction | null {
    const scrollEvent = event.data as scrollData;

    return {
      type: SemanticInteractionType.SCROLL,
      timestamp: event.timestamp,
      additionalData: {
        scrollDirection: scrollEvent.y > 0 ? "down" : "up",
        scrollDistance: Math.abs(scrollEvent.y || 0),
      },
    };
  }

  /**
   * Extract a label for a node
   */
  private _extractLabel(nodeData: any, nodeId: number): string {
    if (!nodeData) {
      return this.virtualDom.resolveNodeLabel?.(nodeId) || `#${nodeId}`;
    }

    if (
      nodeData &&
      nodeData.htmlContent &&
      nodeData.htmlContent.trim().toLowerCase().startsWith("<body")
    ) {
      return "body";
    }

    if (nodeData.semanticRole === "generic_container") {
      return this._extractGenericContainerLabel(nodeData);
    }

    return this._extractInteractiveElementLabel(nodeData, nodeId);
  }

  /**
   * Extract label for generic container elements
   */
  private _extractGenericContainerLabel(nodeData: any): string {
    // Priority 1: H tags (h1-h6)
    if (nodeData.htmlContent) {
      const hTagMatch = nodeData.htmlContent.match(
        /<h[1-6][^>]*>(.*?)<\/h[1-6]>/i,
      );
      if (hTagMatch && hTagMatch[1] && hTagMatch[1].trim()) {
        return hTagMatch[1].trim();
      }
    }

    // Priority 2: Text strings
    const textContent = this._extractTextContent(nodeData);
    if (textContent && textContent.trim()) {
      const cleanText = textContent.trim();
      if (cleanText.length > 0 && cleanText.length <= 100) {
        return cleanText;
      }
    }

    // Priority 3: Tag name
    if (nodeData.originalNode && "tagName" in nodeData.originalNode) {
      const tagName = nodeData.originalNode.tagName?.toLowerCase();
      if (tagName && tagName !== "div" && tagName !== "span") {
        return tagName;
      }
    }

    // Priority 4: Fallback to generic container
    return "generic container";
  }

  /**
   * Extract label for interactive elements
   */
  private _extractInteractiveElementLabel(
    nodeData: any,
    nodeId: number,
  ): string {
    // Priority 1: Check for meaningful attributes from htmlContent
    if (nodeData.htmlContent) {
      const htmlContent = nodeData.htmlContent;

      for (const attr of INTERACTIVE_ATTRIBUTES_WITH_LABEL) {
        const regex = new RegExp(`${attr}="([^"]*)"`, "i");
        const match = htmlContent.match(regex);

        if (match && match[1] && match[1].trim()) {
          const value = match[1].trim();
          // Skip generic IDs that are just numbers or random strings
          if (attr === "id" && /^[0-9a-f]{8,}$/i.test(value)) continue;
          return value;
        }
      }
    }

    // Priority 2: Check for attributes in originalNode if it exists
    if (
      nodeData.originalNode &&
      "attributes" in nodeData.originalNode &&
      nodeData.originalNode.attributes
    ) {
      const attrs = nodeData.originalNode.attributes as Record<string, any>;

      for (const attr of INTERACTIVE_ATTRIBUTES_WITH_LABEL) {
        if (attrs[attr] && attrs[attr].trim()) {
          const value = attrs[attr].trim();
          // Skip generic IDs that are just numbers or random strings
          if (attr === "id" && /^[0-9a-f]{8,}$/i.test(value)) continue;
          return value;
        }
      }
    }

    // Priority 3: Extract text content from the element and its children
    const textContent = this._extractTextContent(nodeData);
    if (textContent && textContent.trim()) {
      const cleanText = textContent.trim();
      // Limit length and clean up
      if (cleanText.length > 0 && cleanText.length <= 100) {
        return cleanText;
      }
    }

    // Priority 4: Use semantic role if available
    if (nodeData.semanticRole && nodeData.semanticRole !== "generic") {
      return nodeData.semanticRole;
    }

    // Priority 5: Fallback to tag name with context
    if (nodeData.originalNode && "tagName" in nodeData.originalNode) {
      const tagName = nodeData.originalNode.tagName?.toLowerCase();
      if (tagName && tagName !== "div" && tagName !== "span") {
        return tagName;
      }
    }

    // Final resort: generic fallback
    return `#${nodeId}`;
  }

  /**
   * Extract text content from a node
   */
  private _extractTextContent(nodeData: any): string {
    if (!nodeData?.htmlContent) return "";

    // Remove script and style tags first
    let html = nodeData.htmlContent
      .replace(/<script[^>]*>.*?<\/script>/gi, "")
      .replace(/<style[^>]*>.*?<\/style>/gi, "");

    // Extract text content
    const textContent = html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return textContent;
  }

  /**
   * Resolve rage clicks in place
   */
  private _resolveRageClicks(interactions: SemanticInteraction[]): void {
    for (const tracker of this.clickTrackers.values()) {
      tracker.timestamps.sort((a, b) => a - b);

      let currentRageSequence: number[] = [];
      for (let i = 0; i < tracker.timestamps.length; i++) {
        const currentTimestamp = tracker.timestamps[i];

        // Keep only relevant clicks for the current window
        currentRageSequence = currentRageSequence.filter(
          (ts) => currentTimestamp - ts <= RAGE_CLICK_THRESHOLD_MS,
        );
        currentRageSequence.push(currentTimestamp);

        if (currentRageSequence.length >= RAGE_CLICK_COUNT_THRESHOLD) {
          const semanticEventToUpdate = interactions.find(
            (e) =>
              e.type === SemanticInteractionType.CLICK &&
              e.nodeId === tracker.nodeId &&
              e.timestamp === currentTimestamp,
          );
          if (semanticEventToUpdate) {
            semanticEventToUpdate.type = SemanticInteractionType.RAGE_CLICK;
            semanticEventToUpdate.additionalData = {
              ...(semanticEventToUpdate.additionalData || {}),
              clickCount: currentRageSequence.length,
              timeWindow: RAGE_CLICK_THRESHOLD_MS,
            };
          }
        }
      }
    }
  }

  /**
   * Detect session end
   */
  private _detectSessionEnd(
    interactions: SemanticInteraction[],
  ): SemanticInteraction[] {
    // Check if there's already a LEAVE_PAGE event
    const hasLeavePage = interactions.some(
      (interaction) => interaction.type === SemanticInteractionType.LEAVE_PAGE,
    );

    if (!hasLeavePage) {
      const lastInteraction = interactions[interactions.length - 1];
      if (
        lastInteraction &&
        this.lastInteractionTimestamp - lastInteraction.timestamp >
          SESSION_END_THRESHOLD_MS
      ) {
        return [
          {
            type: SemanticInteractionType.LEAVE_PAGE,
            timestamp: this.lastInteractionTimestamp,
            additionalData: {
              reason: "inactivity",
              idleTime:
                this.lastInteractionTimestamp - lastInteraction.timestamp,
            },
          },
        ];
      }
    }

    return [];
  }

  /**
   * Finalize interactions: sort and remove duplicates
   */
  private _finalizeInteractions(
    interactions: SemanticInteraction[],
  ): SemanticInteraction[] {
    return interactions
      .sort((a, b) => a.timestamp - b.timestamp)
      .filter((interaction, index, array) => {
        // Remove duplicate rage clicks that might have been added during processing
        if (
          index > 0 &&
          interaction.type === SemanticInteractionType.RAGE_CLICK
        ) {
          const prev = array[index - 1];
          return !(
            prev.type === SemanticInteractionType.RAGE_CLICK &&
            prev.nodeId === interaction.nodeId &&
            Math.abs(prev.timestamp - interaction.timestamp) < 100
          );
        }
        return true;
      });
  }

  private _extractKeyActions(interactions: SemanticInteraction[]): string[] {
    // Example: extract navigation and form submissions as key actions
    return interactions
      .filter(
        (i) =>
          i.type === SemanticInteractionType.NAVIGATION ||
          i.type === SemanticInteractionType.INPUT,
      )
      .map((i) =>
        i.type === SemanticInteractionType.NAVIGATION
          ? `Navigated to "${i.additionalData?.href || "unknown"}"`
          : `Entered input "${i.label || "unknown"}"`,
      );
  }

  private _identifyFrictionPoints(
    interactions: SemanticInteraction[],
  ): string[] {
    const frictionPoints: string[] = [];

    // Rage Clicks
    const rageClicks = interactions.filter(
      (e) => e.type === SemanticInteractionType.RAGE_CLICK,
    );
    for (const rageClick of rageClicks) {
      const label = rageClick.label || "an element";
      const clickCount = rageClick.additionalData?.clickCount || "multiple";
      frictionPoints.push(
        `Rage clicked "${label}" (${clickCount} times) - indicates frustration or unresponsiveness`,
      );
    }

    // Hesitation (long pauses)
    for (let i = 0; i < interactions.length - 1; i++) {
      const current = interactions[i];
      const next = interactions[i + 1];
      const timeDiff = next.timestamp - current.timestamp;
      if (timeDiff > 5000) {
        let actionDescription = `${next.type.toLowerCase()}`;
        if (next.label) {
          actionDescription += ` on "${next.label}"`;
        } else if (next.additionalData?.href) {
          actionDescription += ` to "${next.additionalData.href}"`;
        }
        frictionPoints.push(
          `Hesitated for ${Math.round(timeDiff / 1000)}s before "${actionDescription}" - suggests uncertainty or confusion`,
        );
      }
    }

    // Dead Clicks (clicks with no immediate response)
    for (let i = 0; i < interactions.length; i++) {
      const click = interactions[i];
      if (click.type === SemanticInteractionType.CLICK) {
        let foundResponse = false;
        for (let j = i + 1; j < interactions.length; j++) {
          const next = interactions[j];
          const delay = next.timestamp - click.timestamp;
          if (
            next.type === SemanticInteractionType.RAGE_CLICK &&
            next.nodeId === click.nodeId &&
            delay < 2000
          ) {
            foundResponse = true;
            break;
          }
          if (
            delay <= 2000 &&
            [
              SemanticInteractionType.NAVIGATION,
              SemanticInteractionType.INPUT,
              SemanticInteractionType.SCROLL,
              SemanticInteractionType.HOVER,
            ].includes(next.type)
          ) {
            foundResponse = true;
            break;
          } else if (delay > 2000 && !foundResponse) {
            frictionPoints.push(
              `Clicked "${click.label || "an element"}" but observed no immediate response for ${Math.round(delay / 1000)}s - potential UI bug or slow loading`,
            );
            break;
          }
        }
      }
    }

    return [...new Set(frictionPoints)];
  }
}

export function transformToSemanticInteractions(events: eventWithTime[]): {
  interactions: SemanticInteraction[];
  analysis: UXSessionSummary;
  timestampedSummary: string;
} {
  const parser = new SessionParser();
  return parser.processSession(events);
}

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
 * Transform the rrweb events into semantic interactions
 * @param events - The rrweb events
 * @returns The semantic interactions
 */
export function transformToSemanticInteractions(
  events: eventWithTime[],
): SemanticInteraction[] {
  if (!events.length) return [];

  const normalizedEvents = events.map((event) => ({
    ...event,
    timestamp: event.timestamp,
  }));

  const interactions: SemanticInteraction[] = [];
  const virtualDom = new VirtualDomManager();
  const clickTrackers = new Map<number, ClickTracker>();
  let lastInteractionTimestamp = 0;

  for (let i = 0; i < normalizedEvents.length; i++) {
    const event = normalizedEvents[i];

    // Update virtual DOM
    if (event.type === EventType.FullSnapshot && "data" in event) {
      virtualDom.buildFromSnapshot(event.data);
    } else if (event.type === EventType.IncrementalSnapshot) {
      const source = event.data.source;
      if (source === IncrementalSource.Mutation) {
        virtualDom.applyMutation(event.data as any);
      }
    }

    // Process different event types
    switch (event.type) {
      case EventType.Meta:
        interactions.push(...processMetaEvent(event, virtualDom));
        break;

      case EventType.IncrementalSnapshot:
        const incrementalInteractions = processIncrementalSnapshot(
          event,
          virtualDom,
          clickTrackers,
        );
        interactions.push(...incrementalInteractions);
        break;
    }

    lastInteractionTimestamp = event.timestamp;
  }

  // Detect session end if no explicit leave event
  const sessionEndInteractions = detectSessionEnd(
    interactions,
    lastInteractionTimestamp,
  );
  interactions.push(...sessionEndInteractions);

  // Detect rage clicks based on accumulated click data
  resolveRageClicksInPlace(interactions, clickTrackers);

  // Sort by timestamp and remove duplicates
  return interactions
    .sort((a, b) => a.timestamp - b.timestamp)
    .filter((interaction, index, array) => {
      // Remove duplicate rage clicks that might have been added during processing
      if (index > 0 && interaction.type === "RAGE_CLICK") {
        const prev = array[index - 1];
        return !(
          prev.type === "RAGE_CLICK" &&
          prev.nodeId === interaction.nodeId &&
          Math.abs(prev.timestamp - interaction.timestamp) < 100
        );
      }
      return true;
    });
}

/**
 * Process the meta event
 * @param event - The rrweb event
 * @param virtualDom - The virtual DOM manager
 * @returns The semantic interactions
 */
function processMetaEvent(
  event: eventWithTime,
  virtualDom: VirtualDomManager,
): SemanticInteraction[] {
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
 * @param event - The rrweb event
 * @param virtualDom - The virtual DOM manager
 * @param clickTrackers - The click trackers
 * @returns The semantic interactions
 */
function processIncrementalSnapshot(
  event: eventWithTime,
  virtualDom: VirtualDomManager,
  clickTrackers: Map<number, ClickTracker>,
): SemanticInteraction[] {
  const interactions: SemanticInteraction[] = [];
  const source = (event.data as any).source;
  switch (source) {
    case IncrementalSource.MouseInteraction:
      const mouseInteractions = processMouseInteraction(
        event,
        virtualDom,
        clickTrackers,
      );
      interactions.push(...mouseInteractions);
      break;

    case IncrementalSource.Input:
      const inputInteraction = processInputEvent(event, virtualDom);
      if (inputInteraction) interactions.push(inputInteraction);
      break;

    case IncrementalSource.Scroll:
      const scrollInteraction = processScrollEvent(event);
      if (scrollInteraction) interactions.push(scrollInteraction);
      break;
  }
  return interactions;
}

/**
 * Extract a label for a node
 * @param nodeData - The node data
 * @param virtualDom - The virtual DOM manager
 * @param nodeId - The node ID
 * @returns The better label
 */
function extractLabel(
  nodeData: any,
  virtualDom: VirtualDomManager,
  nodeId: number,
): string {
  if (!nodeData) {
    return virtualDom.resolveNodeLabel?.(nodeId) || `#${nodeId}`;
  }

  if (
    nodeData &&
    nodeData.htmlContent &&
    nodeData.htmlContent.trim().toLowerCase().startsWith("<body")
  ) {
    return "body";
  }

  if (nodeData.semanticRole === "generic_container") {
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
    const textContent = extractTextContent(nodeData);
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

  // Priority 1: Check for meaningful attributes from htmlContent
  if (nodeData.htmlContent) {
    const htmlContent = nodeData.htmlContent;
    // Check for the most meaningful attributes first

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
  const textContent = extractTextContent(nodeData);
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
 * @param nodeData - The node data
 * @returns The text content
 */
function extractTextContent(nodeData: any): string {
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
 * Process a mouse interaction event
 * @param event - The rrweb event
 * @param virtualDom - The virtual DOM manager
 * @param clickTrackers - The click trackers
 * @returns The semantic interactions
 */
function processMouseInteraction(
  event: eventWithTime,
  virtualDom: VirtualDomManager,
  clickTrackers: Map<number, ClickTracker>,
): SemanticInteraction[] {
  const interactions: SemanticInteraction[] = [];
  const mouseEvent = event.data as mouseInteractionData;
  const nodeId = mouseEvent.id;

  const nodeData = virtualDom.getEnrichedNodeData(nodeId);

  const label = extractLabel(nodeData, virtualDom, nodeId);

  if (mouseEvent.type === MouseInteractions.Click || mouseEvent.type === 0) {
    // Track click for rage click detection
    if (!clickTrackers.has(nodeId)) {
      clickTrackers.set(nodeId, { nodeId, timestamps: [], label });
    }
    const tracker = clickTrackers.get(nodeId)!;
    tracker.timestamps.push(event.timestamp);
    tracker.label = label;
    // Add regular click interaction
    interactions.push({
      type: SemanticInteractionType.CLICK,
      label,
      semanticRole: virtualDom.getEnrichedNodeData(nodeId)?.semanticRole,
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
 * Process an input event
 * @param event - The rrweb event
 * @param virtualDom - The virtual DOM manager
 * @returns The semantic interaction
 */
function processInputEvent(
  event: eventWithTime,
  virtualDom: VirtualDomManager,
): SemanticInteraction | null {
  const inputEvent = event.data as inputData;
  const nodeId = inputEvent.id;

  const nodeData = virtualDom.getEnrichedNodeData(nodeId);

  // Extract meaningful label from DOM
  let label = nodeData?.semanticRole;
  if (!label) {
    label = virtualDom.resolveNodeLabel?.(nodeId);
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

  return {
    type: SemanticInteractionType.INPUT,
    label,
    timestamp: event.timestamp,
    semanticRole: virtualDom.getEnrichedNodeData(nodeId)?.semanticRole,
    nodeId,
    additionalData: {
      value: inputEvent.text || undefined,
    },
  };
}

/**
 * Process a scroll event
 * @param event - The rrweb event
 * @returns The semantic interaction
 */
function processScrollEvent(event: eventWithTime): SemanticInteraction | null {
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
 * Resolve rage clicks in place
 * @param interactions - The semantic interactions
 * @param clickTrackers - The click trackers
 */
function resolveRageClicksInPlace(
  interactions: SemanticInteraction[],
  clickTrackers: Map<number, ClickTracker>,
) {
  for (const tracker of clickTrackers.values()) {
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
 * @param interactions - The semantic interactions
 * @param lastEventTimestamp - The last event timestamp
 * @returns The semantic interactions
 */
function detectSessionEnd(
  interactions: SemanticInteraction[],
  lastEventTimestamp: number,
): SemanticInteraction[] {
  // Check if there's already a LEAVE_PAGE event
  const hasLeavePage = interactions.some(
    (interaction) => interaction.type === SemanticInteractionType.LEAVE_PAGE,
  );

  if (!hasLeavePage) {
    const lastInteraction = interactions[interactions.length - 1];
    if (
      lastInteraction &&
      lastEventTimestamp - lastInteraction.timestamp > SESSION_END_THRESHOLD_MS
    ) {
      return [
        {
          type: SemanticInteractionType.LEAVE_PAGE,
          timestamp: lastEventTimestamp,
          additionalData: {
            reason: "inactivity",
            idleTime: lastEventTimestamp - lastInteraction.timestamp,
          },
        },
      ];
    }
  }

  return [];
}

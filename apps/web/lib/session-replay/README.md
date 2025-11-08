# RRWeb v2 Semantic Interaction Transformer

This module transforms raw `eventWithTime[]` from rrweb into structured `SemanticInteraction[]` with enhanced semantic understanding and **improved label extraction**.

## Features

### ✅ Timestamp Normalization

- All timestamps are normalized relative to the first event
- Consistent time-based analysis across sessions

### 🧠 Enhanced Virtual DOM Integration

- Uses `VirtualDomManager` with rrweb-snapshot mirror
- **Improved label extraction** with meaningful text content
- **Priority-based label extraction** for better user intent understanding

### 🔍 Rage Click Detection

- Detects multiple clicks on same node within 1 second
- Configurable threshold (default: 3+ clicks in 1s window)
- Provides click count and time window in additional data

### 🚪 SPA Navigation Detection

- Detects navigation via `EventType.Meta` events
- Captures `href` in additional data
- Supports client-side routing patterns

### 🛑 Session End Detection

- Identifies end of session via long inactivity (>30s idle)
- Handles missing leave events gracefully
- Provides inactivity reason and duration

## Enhanced Label Extraction

The transformer now provides **much more meaningful labels** instead of generic element names like "div", "body", "form".

### Label Extraction Priority

1. **Meaningful Attributes** - `aria-label`, `placeholder`, `title`, `alt`, `data-testid`
2. **Text Content** - Extracts text from element and its children
3. **Semantic Role** - Uses semantic roles when meaningful
4. **CSS Classes** - Extracts meaningful class names
5. **Tag Names** - Uses specific tags (button, input, etc.)
6. **Fallback** - Node ID as last resort

### Examples

**Before (Poor Labels):**

```json
[
  { "type": "CLICK", "label": "div", "timestamp": 7789 },
  { "type": "CLICK", "label": "form", "timestamp": 10622 },
  { "type": "INPUT", "label": "select", "timestamp": 6041 }
]
```

**After (Improved Labels):**

```json
[
  { "type": "CLICK", "label": "Submit Form", "timestamp": 7789 },
  { "type": "CLICK", "label": "Create Account", "timestamp": 10622 },
  { "type": "INPUT", "label": "Email Address", "timestamp": 6041 }
]
```

### Rage Click Detection Improvement

**Before:** `"User rage clicked on 'div' and 'form'"`
**After:** `"User rage clicked on 'Submit Button' and 'Create Account'"`

→ Much clearer indication of user frustration with specific actions!

## Usage

```typescript
import { transformToSemanticInteractions } from "./lib/rrweb-v2";

const rrwebEvents: eventWithTime[] = [
  /* your rrweb events */
];
const semanticInteractions = transformToSemanticInteractions(rrwebEvents);
```

## Output Format

```typescript
type SemanticInteraction = {
  type:
    | "CLICK"
    | "HOVER"
    | "INPUT"
    | "SCROLL"
    | "RAGE_CLICK"
    | "NAVIGATION"
    | "LEAVE_PAGE";
  label?: string; // Enhanced meaningful labels
  timestamp: number; // Normalized relative to first event
  nodeId?: number;
  additionalData?: Record<string, any>;
};
```

## Example Output

```json
[
  {
    "type": "NAVIGATION",
    "timestamp": 0,
    "additionalData": { "href": "/signup" }
  },
  { "type": "INPUT", "label": "Email Address", "timestamp": 1200 },
  { "type": "CLICK", "label": "Start Trial", "timestamp": 3100 },
  { "type": "RAGE_CLICK", "label": "Start Trial", "timestamp": 3400 },
  { "type": "SCROLL", "timestamp": 5000 },
  {
    "type": "NAVIGATION",
    "timestamp": 7400,
    "additionalData": { "href": "/dashboard" }
  }
]
```

## Configuration

### Thresholds

```typescript
const RAGE_CLICK_THRESHOLD_MS = 1000; // 1 second window
const RAGE_CLICK_COUNT_THRESHOLD = 3; // Minimum clicks
const IDLE_TIME_THRESHOLD_MS = 30000; // 30 seconds
const SESSION_END_THRESHOLD_MS = 30000; // 30 seconds
```

### Label Extraction Priority

1. `aria-label` attribute
2. `placeholder` attribute
3. `title` attribute
4. `alt` attribute
5. `data-testid` attribute
6. Text content from element and children
7. Semantic role (if meaningful)
8. Meaningful CSS class names
9. Specific tag names (button, input, etc.)
10. Node ID fallback

## Integration with Existing Codebase

This transformer integrates with the existing `VirtualDomManager` from `../semantic/virtual-dom` and follows the same patterns as the existing semantic analysis modules.

### Key Dependencies

- `@rrweb/types` for event type definitions
- `VirtualDomManager` for DOM context extraction
- Existing constants and thresholds from the codebase

## Error Handling

- Gracefully handles missing or malformed events
- Provides fallback labels when DOM context is unavailable
- Removes duplicate rage click detections
- Handles edge cases in session end detection
- **Enhanced error recovery** for label extraction

## Benefits of Improved Labels

- **Better User Intent Understanding** - Clear labels show what users are trying to do
- **More Actionable Insights** - Specific labels help identify exact friction points
- **Improved Analytics** - Meaningful labels enable better user behavior analysis
- **Enhanced Debugging** - Clear labels make it easier to reproduce issues

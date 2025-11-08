import { VirtualDomNode } from "./types";
import { mutationData } from "@rrweb/types";
import { getCssSelector, getHtmlContent } from "./helpers";

const TAG_TO_ROLE_MAP: Record<string, string> = {
  a: "link", // Will be overridden for non-href links
  button: "button",
  textarea: "textbox",
  form: "form",
  img: "image",
  video: "video",
  audio: "audio",
  canvas: "canvas",
  svg: "graphic",
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
  h5: "heading",
  h6: "heading",
  p: "paragraph",
  ul: "list",
  ol: "list",
  li: "list_item",
  nav: "navigation",
  header: "banner",
  footer: "contentinfo",
  main: "main",
  aside: "complementary",
  article: "article",
  section: "region",
  dialog: "dialog",
  table: "table",
  tr: "row",
  td: "cell",
  th: "cell",
  thead: "rowgroup",
  tbody: "rowgroup",
  tfoot: "rowgroup",
  label: "label",
  fieldset: "group",
  legend: "legend",
  div: "generic_container", // Will be overridden for interactive elements
  span: "generic_container", // Will be overridden for interactive elements
  iframe: "iframe",
  object: "object",
  embed: "embed",
};

export class VirtualDomManager {
  private nodeMap = new Map<number, VirtualDomNode>();
  private rootNodeId: number | null = null;
  private ariaLabelMap = new Map<string, VirtualDomNode>();

  /**
   * Build the virtual DOM from a snapshot
   * @param snapshot - The snapshot
   */
  public buildFromSnapshot(snapshot: any): void {
    this.nodeMap.clear();
    this.ariaLabelMap.clear();
    this.rootNodeId = null;

    const walk = (node: any, parentId: number | null = null) => {
      const vNode: VirtualDomNode = {
        id: node.id,
        type: node.type,
        tagName: node.tagName,
        attributes: node.attributes ?? {},
        textContent: node.textContent,
        parentId,
        childNodes: [],
      };

      this.nodeMap.set(node.id, vNode);

      if (parentId === null) {
        this.rootNodeId = node.id;
      }

      if (node.attributes?.id) {
        this.ariaLabelMap.set(node.attributes.id, vNode);
      }

      if (parentId !== null) {
        const parent = this.nodeMap.get(parentId);
        parent?.childNodes.push(node.id);
      }

      if (node.childNodes) {
        for (const child of node.childNodes) {
          walk(child, node.id);
        }
      }
    };

    walk(snapshot.node);
    this.updateSemanticRoles();
  }

  public applyMutation(mutation: mutationData): void {
    for (const removed of mutation.removes) {
      const nodeToRemove = this.nodeMap.get(removed.id);
      if (nodeToRemove) {
        if (nodeToRemove.attributes?.id) {
          this.ariaLabelMap.delete(nodeToRemove.attributes.id);
        }

        this.nodeMap.delete(removed.id);
        const parent = this.nodeMap.get(removed.parentId);
        if (parent) {
          parent.childNodes = parent.childNodes.filter(
            (childId) => childId !== removed.id,
          );
        }
      }
    }

    for (const added of mutation.adds) {
      const walk = (node: any, parentId: number | null = null) => {
        const vNode: VirtualDomNode = {
          id: node.id,
          type: node.type,
          tagName: node.tagName,
          attributes: node.attributes ?? {},
          textContent: node.textContent,
          parentId,
          childNodes: [],
        };

        this.nodeMap.set(node.id, vNode);

        if (node.attributes?.id) {
          this.ariaLabelMap.set(node.attributes.id, vNode);
        }

        if (parentId !== null) {
          const parent = this.nodeMap.get(parentId);
          parent?.childNodes.push(node.id);
        }

        if (node.childNodes) {
          for (const child of node.childNodes) {
            walk(child, node.id);
          }
        }
      };

      walk(added.node, added.parentId);
    }

    for (const attr of mutation.attributes) {
      const node = this.nodeMap.get(attr.id);
      if (node) {
        const oldId = node.attributes?.id;

        for (const key in attr.attributes) {
          const value = attr.attributes[key];
          if (value === null) {
            delete node.attributes[key];
          } else {
            node.attributes[key] = value;
          }
        }

        const newId = node.attributes?.id;
        if (oldId !== newId) {
          if (oldId) this.ariaLabelMap.delete(oldId);
          if (newId) this.ariaLabelMap.set(newId, node);
        }
      }
    }

    for (const text of mutation.texts) {
      const node = this.nodeMap.get(text.id);
      if (node && node.type === 3) {
        node.textContent = text.value ?? "";
      }
    }

    this.updateSemanticRoles();
  }

  private updateSemanticRoles(): void {
    for (const node of this.nodeMap.values()) {
      node.semanticRole = this.getEnhancedSemanticRole(node);
    }
  }

  private getEnhancedSemanticRole(node: VirtualDomNode): string {
    const tagName = node.tagName?.toLowerCase() || "div";
    const attributes = node.attributes;

    if (attributes.role) return attributes.role as string;

    if (attributes["aria-expanded"] !== undefined) return "button";
    if (attributes["aria-pressed"] !== undefined) return "button";
    if (attributes["aria-checked"] !== undefined) return "checkbox";
    if (attributes["aria-selected"] !== undefined) return "option";
    if (attributes["aria-haspopup"] !== undefined) return "button";
    if (attributes["aria-controls"] !== undefined) return "button";

    // Enhanced semantic role detection
    const baseRole = TAG_TO_ROLE_MAP[tagName];

    if (!baseRole) return tagName;

    // Handle special cases that need attribute checking
    if (tagName === "a") {
      return attributes.href ? "link" : "button";
    }

    if (tagName === "input") {
      const type = attributes.type as string;
      if (type) {
        if (
          [
            "text",
            "email",
            "password",
            "number",
            "tel",
            "url",
            "search",
          ].includes(type)
        )
          return "form_input";
        if (["checkbox", "radio"].includes(type)) return type;
        if (type === "submit") return "button";
        if (type === "button") return "button";
        if (type === "file") return "file_input";
        if (type === "range") return "slider";
        if (type === "color") return "color_input";
        if (type === "date" || type === "datetime-local" || type === "time")
          return "date_input";
      }
      return "input";
    }

    if (tagName === "select") {
      return attributes.multiple ? "listbox" : "dropdown";
    }

    if (tagName === "div" || tagName === "span") {
      // Check for interactive attributes
      if (
        attributes.onclick ||
        attributes.onmouseover ||
        attributes.onmouseenter ||
        attributes.onfocus ||
        attributes.onblur ||
        attributes.tabindex ||
        attributes["data-interactive"] ||
        attributes["data-clickable"] ||
        attributes["role"] === "button"
      ) {
        return "button";
      }
      // Check for form-related attributes
      if (attributes["data-form"] || attributes["data-input"]) {
        return "textbox";
      }
      return "generic_container";
    }

    return baseRole;
  }

  public getNode(id: number): VirtualDomNode | undefined {
    return this.nodeMap.get(id);
  }

  public getEnrichedNodeData(nodeId: number): {
    htmlContent: string;
    cssSelector: string;
    semanticRole: string;
  } | null {
    const node = this.nodeMap.get(nodeId);

    if (!node) return null;

    const htmlContent = getHtmlContent(node, this.nodeMap);
    const cssSelector = getCssSelector(node, this.nodeMap);
    const semanticRole =
      node.semanticRole || this.getEnhancedSemanticRole(node);

    return { htmlContent, cssSelector, semanticRole };
  }

  public resolveNodeLabel(nodeId: number): string | undefined {
    const node = this.nodeMap.get(nodeId);
    if (!node) return undefined;

    // 1. Check for explicit accessibility attributes
    if (node.attributes["aria-label"]) {
      return node.attributes["aria-label"];
    }

    if (node.attributes["aria-labelledby"]) {
      const labelledBy = node.attributes["aria-labelledby"];
      const labelIds = labelledBy.split(/\s+/);

      for (const labelId of labelIds) {
        const labelNode = this.ariaLabelMap.get(labelId);
        if (labelNode?.textContent?.trim()) {
          return labelNode.textContent.trim();
        }
      }
    }

    if (node.attributes["title"]) {
      return node.attributes["title"];
    }

    if (node.attributes["alt"]) {
      return node.attributes["alt"];
    }

    // 2. Check for placeholder text
    if (node.attributes["placeholder"]) {
      return node.attributes["placeholder"];
    }

    // 3. Check for visible text content
    if (node.textContent?.trim()) {
      return node.textContent.trim();
    }

    // 4. Check for associated label elements
    if (this.isFormControl(node)) {
      const label = this.findAssociatedLabel(node);
      if (label) return label;
    }

    // 5. Check for parent label context
    const parentLabel = this.findParentLabel(node);
    if (parentLabel) return parentLabel;

    // 6. Check for sibling text context
    const siblingText = this.findSiblingText(node);
    if (siblingText) return siblingText;

    // 7. Check for image context
    if (node.tagName === "IMG") {
      const imageContext = this.findImageContext(node);
      if (imageContext) return imageContext;
    }

    // 8. Fallback to semantic role
    const semanticRole =
      node.semanticRole || this.getEnhancedSemanticRole(node);
    if (semanticRole && semanticRole !== "unknown") {
      return semanticRole;
    }

    // 9. Fallback to CSS selector
    const cssSelector = getCssSelector(node, this.nodeMap);
    if (cssSelector) {
      return cssSelector;
    }

    return undefined;
  }

  private isFormControl(node: VirtualDomNode): boolean {
    const formControls = ["INPUT", "TEXTAREA", "SELECT", "BUTTON"];
    return formControls.includes(node.tagName || "");
  }

  private findAssociatedLabel(node: VirtualDomNode): string | undefined {
    // Check for explicit for attribute
    if (node.attributes.id) {
      const label = this.findLabelByFor(node.attributes.id);
      if (label) return label;
    }

    return undefined;
  }

  private findLabelByFor(forId: string): string | undefined {
    for (const [_, labelNode] of this.ariaLabelMap) {
      if (
        labelNode.tagName === "LABEL" &&
        labelNode.attributes["for"] === forId
      ) {
        return labelNode.textContent?.trim();
      }
    }
    return undefined;
  }

  private findParentLabel(node: VirtualDomNode): string | undefined {
    let current = node;
    while (current.parentId !== null) {
      const parent = this.nodeMap.get(current.parentId);
      if (!parent) break;

      if (parent.tagName === "LABEL") {
        return parent.textContent?.trim();
      }

      // Check for aria-label on parent
      if (parent.attributes["aria-label"]) {
        return parent.attributes["aria-label"];
      }

      current = parent;
    }
    return undefined;
  }

  private findSiblingText(node: VirtualDomNode): string | undefined {
    if (node.parentId === null) return undefined;

    const parent = this.nodeMap.get(node.parentId);
    if (!parent) return undefined;

    // Look for text siblings
    for (const childId of parent.childNodes) {
      const sibling = this.nodeMap.get(childId);
      if (sibling && sibling.id !== node.id && sibling.textContent?.trim()) {
        return sibling.textContent.trim();
      }
    }

    return undefined;
  }

  private findImageContext(node: VirtualDomNode): string | undefined {
    // Check for figure caption
    let current = node;
    while (current.parentId !== null) {
      const parent = this.nodeMap.get(current.parentId);
      if (!parent) break;

      if (parent.tagName === "FIGURE") {
        // Look for figcaption
        for (const childId of parent.childNodes) {
          const child = this.nodeMap.get(childId);
          if (child?.tagName === "FIGCAPTION" && child.textContent?.trim()) {
            return child.textContent.trim();
          }
        }
      }

      current = parent;
    }

    return undefined;
  }

  public getAllNodes(): VirtualDomNode[] {
    return Array.from(this.nodeMap.values());
  }

  public getNodesByRole(role: string): VirtualDomNode[] {
    return this.getAllNodes().filter(
      (node) =>
        (node.semanticRole || this.getEnhancedSemanticRole(node)) === role,
    );
  }

  public getInteractiveNodes(): VirtualDomNode[] {
    return this.getAllNodes().filter((node) => {
      const role = node.semanticRole || this.getEnhancedSemanticRole(node);
      return [
        "button",
        "link",
        "textbox",
        "checkbox",
        "radio",
        "dropdown",
        "listbox",
      ].includes(role);
    });
  }

  public getFormControls(): VirtualDomNode[] {
    return this.getAllNodes().filter((node) => this.isFormControl(node));
  }

  public getNodePath(nodeId: number): VirtualDomNode[] {
    const path: VirtualDomNode[] = [];
    let current = this.nodeMap.get(nodeId);

    while (current) {
      path.unshift(current);
      if (current.parentId !== null) {
        current = this.nodeMap.get(current.parentId);
      } else {
        break;
      }
    }

    return path;
  }

  public getNodeDepth(nodeId: number): number {
    return this.getNodePath(nodeId).length - 1;
  }

  public getDescendants(nodeId: number): VirtualDomNode[] {
    const descendants: VirtualDomNode[] = [];
    const node = this.nodeMap.get(nodeId);

    if (!node) return descendants;

    const traverse = (currentNode: VirtualDomNode) => {
      for (const childId of currentNode.childNodes) {
        const child = this.nodeMap.get(childId);
        if (child) {
          descendants.push(child);
          traverse(child);
        }
      }
    };

    traverse(node);
    return descendants;
  }

  public getAncestors(nodeId: number): VirtualDomNode[] {
    const ancestors: VirtualDomNode[] = [];
    let current = this.nodeMap.get(nodeId);

    while (current?.parentId !== null) {
      const parent = current?.parentId
        ? this.nodeMap.get(current?.parentId)
        : null;
      if (parent) {
        ancestors.push(parent);
        current = parent;
      } else {
        break;
      }
    }

    return ancestors;
  }
}

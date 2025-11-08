import { VirtualDomNode } from "./types";

export function getCssSelector(
  node: VirtualDomNode,
  nodeMap: Map<number, VirtualDomNode>,
): string {
  if (!node || !node.tagName) return "";

  let selector = node.tagName.toLowerCase();

  if (node.attributes.id) {
    selector += `#${node.attributes.id}`;
  } else if (node.attributes.class) {
    const classes = (node.attributes.class as string)
      .split(" ")
      .filter(Boolean);
    if (classes.length > 0) {
      selector += `.${classes.join(".")}`;
    }
  }

  if (node.parentId !== null) {
    const parent = nodeMap.get(node.parentId);
    if (parent) {
      const siblings = parent.childNodes
        .map((id) => nodeMap.get(id))
        .filter(Boolean) as VirtualDomNode[];

      const sameTagSiblings = siblings.filter(
        (s) => s.tagName === node.tagName,
      );
      if (sameTagSiblings.length > 1) {
        const index = sameTagSiblings.indexOf(node) + 1;
        if (index > 0) selector += `:nth-child(${index})`;
      }
    }
  }

  return selector;
}

export function getHtmlContent(
  node: VirtualDomNode,
  nodeMap: Map<number, VirtualDomNode>,
): string {
  if (!node) return "";

  if (node.type === 3) return node.textContent || "";

  if (node.type === 2) {
    const tagName = node.tagName?.toLowerCase() || "div";
    let attributesStr = "";

    for (const key in node.attributes) {
      if (Object.prototype.hasOwnProperty.call(node.attributes, key)) {
        let value = node.attributes[key];
        if (typeof value === "object" && value !== null) {
          if (key === "style") {
            value = Object.entries(value)
              .map(([prop, val]) => `${prop}:${val}`)
              .join(";");
          } else {
            value = JSON.stringify(value);
          }
        }
        attributesStr += ` ${key}="${String(value).replace(/"/g, "&quot;")}"`;
      }
    }

    let innerHtml = "";
    for (const childId of node.childNodes) {
      const childNode = nodeMap.get(childId);
      if (childNode) innerHtml += getHtmlContent(childNode, nodeMap);
    }

    return `<${tagName}${attributesStr}>${innerHtml}</${tagName}>`;
  }

  return "";
}

export function getSemanticRole(node: VirtualDomNode): string {
  if (!node || !node.tagName) return "unknown";

  const tagName = node.tagName.toLowerCase();
  const attributes = node.attributes;

  if (attributes.role) return attributes.role as string;
  // @TODO: One source of truth for tags
  switch (tagName) {
    case "a":
      return "link";
    case "button":
      return "button";
    case "input":
      const type = attributes.type as string;
      if (type) {
        if (
          ["text", "email", "password", "number", "tel", "url"].includes(type)
        )
          return "textbox";
        if (["checkbox", "radio"].includes(type)) return type;
        if (type === "submit") return "submit_button";
      }
      return "input";
    case "textarea":
      return "textarea";
    case "select":
      return "dropdown";
    case "form":
      return "form";
    case "img":
      return "image";
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return "heading";
    case "p":
      return "paragraph";
    case "ul":
    case "ol":
      return "list";
    case "li":
      return "list_item";
    case "nav":
      return "navigation";
    case "header":
      return "header";
    case "footer":
      return "footer";
    case "main":
      return "main_content";
    case "aside":
      return "sidebar";
    case "article":
      return "article";
    case "section":
      return "section";
    case "dialog":
      return "dialog";
    case "div":
    case "span":
      if (
        attributes.onclick ||
        attributes.tabindex ||
        attributes["data-interactive"]
      ) {
        return "interactive_element";
      }
      return "generic_container";
    default:
      return tagName;
  }
}

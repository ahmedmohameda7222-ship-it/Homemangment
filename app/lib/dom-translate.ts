import type { AppLanguage } from "./i18n-runtime";
import { translateText } from "./i18n-runtime";

const TEXT_NODE_ORIGINALS = new WeakMap<Text, string>();
const ELEMENT_ATTRS = ["placeholder", "title", "aria-label"] as const;

type TranslatableRoot = Document | DocumentFragment | Element;

function shouldSkipNode(node: Node) {
  const parent = node.parentElement;
  if (!parent) return true;
  const tag = parent.tagName.toLowerCase();
  return tag === "script" || tag === "style" || tag === "textarea" || tag === "input" || parent.closest("[data-no-translate]") !== null;
}

function setNodeValue(node: Text, nextValue: string) {
  if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
}

function translateTextNode(node: Text, language: AppLanguage) {
  if (shouldSkipNode(node)) return;
  if (!TEXT_NODE_ORIGINALS.has(node)) TEXT_NODE_ORIGINALS.set(node, node.nodeValue || "");
  const original = TEXT_NODE_ORIGINALS.get(node) || "";
  const trimmed = original.trim();
  if (!trimmed) return;
  const translated = translateText(trimmed, language);
  if (translated === trimmed) {
    setNodeValue(node, original);
    return;
  }
  setNodeValue(node, original.replace(trimmed, translated));
}

function translateElementAttrs(element: Element, language: AppLanguage) {
  ELEMENT_ATTRS.forEach((attr) => {
    const originalAttr = `data-i18n-original-${attr}`;
    const existing = element.getAttribute(attr);
    if (!existing) return;
    if (!element.hasAttribute(originalAttr)) element.setAttribute(originalAttr, existing);
    const original = element.getAttribute(originalAttr) || existing;
    const translated = translateText(original, language);
    if (existing !== translated) element.setAttribute(attr, translated);
  });
}

export function applyDomTranslations(root: TranslatableRoot, language: AppLanguage) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    translateTextNode(current as Text, language);
    current = walker.nextNode();
  }

  if (root instanceof Element) translateElementAttrs(root, language);
  root.querySelectorAll("[placeholder], [title], [aria-label]").forEach((element) => translateElementAttrs(element, language));
}

export function watchDomTranslations(language: AppLanguage) {
  if (typeof document === "undefined") return () => {};
  let frame = 0;
  const run = () => applyDomTranslations(document.body, language);
  const schedule = () => {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(run);
  };
  run();
  const observer = new MutationObserver(schedule);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["placeholder", "title", "aria-label"] });
  return () => {
    window.cancelAnimationFrame(frame);
    observer.disconnect();
  };
}

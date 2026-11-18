"use client";

import { useEffect } from "react";

const AGUI_RE = /AG-UI|AGUI|ag-ui/g;
const BRAND = "Aguickore";
const LOGO = "/icon-light.png";

// WeakSet to avoid observing the same root/element twice
const observed = new WeakSet<Node>();

function patchAttributes(el: Element) {
  for (const attr of ["aria-label", "title", "alt", "placeholder"]) {
    const val = el.getAttribute(attr);
    if (val && /AG-UI|AGUI|ag-ui/i.test(val)) {
      el.setAttribute(attr, val.replace(/AG-UI|AGUI|ag-ui/gi, BRAND));
    }
  }
  // Replace the CopilotKit kite logo with the Aguickore favicon
  if (el.tagName.toLowerCase() === "img" && el.classList.contains("cpk-launcher-mark")) {
    if (el.getAttribute("src") !== LOGO) el.setAttribute("src", LOGO);
    if (el.getAttribute("alt") !== BRAND) el.setAttribute("alt", BRAND);
  }
}

function patchText(root: Node) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) nodes.push(n as Text);
  for (const node of nodes) {
    const v = node.nodeValue;
    if (v && /AG-UI|AGUI|ag-ui/i.test(v)) {
      node.nodeValue = v.replace(/AG-UI|AGUI|ag-ui/gi, BRAND);
    }
  }
}

function observeRoot(root: Node) {
  if (observed.has(root)) return;
  observed.add(root);
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "childList") {
        m.addedNodes.forEach((node) => patchDeep(node));
      } else if (m.type === "characterData") {
        const v = (m.target as Text).nodeValue;
        if (v && /AG-UI|AGUI|ag-ui/i.test(v)) patchText(m.target as Node);
      } else if (m.type === "attributes") {
        patchAttributes(m.target as Element);
      }
    }
  });
  observer.observe(root, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    // Solo atributos de texto: NO "class" ni "src" (se disparan decenas de
    // veces por segundo con animaciones/tailwind y ralentizaban el navegador)
    attributeFilter: ["aria-label", "title", "alt", "placeholder"],
  });
}

function patchDeep(node: Node) {
  patchText(node);
  if (node instanceof Element) {
    patchAttributes(node);
    node.querySelectorAll("*").forEach((el) => {
      patchAttributes(el);
      if (el.shadowRoot) {
        patchDeep(el.shadowRoot);
        observeRoot(el.shadowRoot);
      }
    });
    if (node.shadowRoot) {
      patchDeep(node.shadowRoot);
      observeRoot(node.shadowRoot);
    }
  }
}

export function BrandOverride() {
  useEffect(() => {
    patchDeep(document);
    observeRoot(document.body);

    // Patch + observe newly attached shadow roots (CopilotKit web inspector uses them)
    const origAttachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function (init: ShadowRootInit) {
      const sr = origAttachShadow.call(this, init);
      queueMicrotask(() => {
        patchDeep(sr);
        observeRoot(sr);
      });
      return sr;
    };

    return () => {
      Element.prototype.attachShadow = origAttachShadow;
    };
  }, []);

  return null;
}

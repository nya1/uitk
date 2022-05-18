import { createCSSHashId } from "./createCSSHashId";

export const injectStyleIntoGivenDocument = (
  css: string,
  documentAlt: Document | undefined
): void => {
  if (!documentAlt) return;
  const style = documentAlt.createElement("style");
  const head = documentAlt.head;
  const hash = createCSSHashId(css);
  // The style has not been injected yet
  if (documentAlt.querySelectorAll(`[data-styleid='${hash}']`).length === 0) {
    style.setAttribute("data-styleid", hash);
    style.textContent = css;
    head.appendChild(style);
  }
};

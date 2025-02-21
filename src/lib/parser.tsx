import {
  DOMNode,
  Element,
  HTMLReactParserOptions,
  Text,
} from "html-react-parser";
import parse from "html-react-parser";
import { toHtml } from "hast-util-to-html";
import React from "react";
import { languageMap } from "./utils";
import { all, createLowlight } from "lowlight";

const lowlight = createLowlight(all);

export function htmlParser(text: string): React.ReactNode {
  const options: HTMLReactParserOptions = {
    replace: (domNode: DOMNode) => {
      if (domNode instanceof Element && domNode.tagName === "code") {
        const className = domNode.attribs.class || "";
        const languageMatch = className.match(/language-(\w+)/);
        let language = languageMatch ? languageMatch[1] : "plaintext";

        // Convert short names (e.g., "js") to full names (e.g., "javascript")
        language = languageMap[language] || language;

        if (lowlight.listLanguages().includes(language)) {
          // Extract raw text content
          const textContent = domNode.children
            .map((child) => (child instanceof Text ? child.data : ""))
            .join("");

          // Apply lowlight syntax highlighting
          const highlighted = lowlight.highlight(language, textContent);
          // Using 'toHtml' to reconstruct syntax tree provided by lowlight
          const highlightedHtml = toHtml(highlighted);

          return (
            <code
              className={`language-${language} hljs`}
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          );
        }
      }
    },
  };

  return parse(text, options);
}

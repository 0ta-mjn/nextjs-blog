"use client";

import { MermaidProps } from "mdx-mermaid/Mermaid";
import mermaid from "mermaid";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

export default function Mermaid({ chart }: MermaidProps) {
  const theme = useTheme();
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    mermaid.initialize({
      startOnLoad: false,
      theme: theme.theme == "dark" ? "dark" : "base",
    });

    const id = `mermaid-${Math.random().toString(36).slice(2)}`;
    mermaid.render(id, chart).then(({ svg, bindFunctions }) => {
      if (!ref.current) return;
      ref.current.innerHTML = svg;
      bindFunctions?.(ref.current);
    });
  }, [chart, theme]);

  return (
    <pre className="mermaid" data-mermaid-src={chart} ref={ref}>
      {chart}
    </pre>
  );
}

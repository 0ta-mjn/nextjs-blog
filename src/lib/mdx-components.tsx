import { Link } from "@/i18n/navigation";
import Mermaid from "@/lib/mdx-mermaid";

export const mdxComponents = {
  a: (props: React.ComponentPropsWithoutRef<"a">) => (
    <Link
      {...props} // href, className など元の属性をそのまま継承
      href={props.href || "/"} // href 属性を指定
      target="_blank"
      rel="noopener noreferrer" // セキュリティ対策も同時に付与
    />
  ),
  mermaid: Mermaid,
} as const;

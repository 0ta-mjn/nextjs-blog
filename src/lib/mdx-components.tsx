// lib/mdx-components.tsx

export const mdxComponents = {
  a: (props: React.ComponentPropsWithoutRef<"a">) => (
    <a
      {...props} // href, className など元の属性をそのまま継承
      target="_blank"
      rel="noopener noreferrer" // セキュリティ対策も同時に付与
    />
  ),
} as const;

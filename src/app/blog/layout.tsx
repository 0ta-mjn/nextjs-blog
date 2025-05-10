import { USERNAME } from "@/const";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${USERNAME}'s Blog`,
  description: "A blog about my tech journey",
};

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

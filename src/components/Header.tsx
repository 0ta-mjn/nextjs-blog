"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { BsGithub, BsMoon, BsSun, BsTwitterX } from "react-icons/bs";
import { Button } from "./ui/button";
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex w-full items-center justify-center px-4 sticky top-0 z-50 bg-header/60 backdrop-blur border-b border-b-muted">
      <div className="container flex justify-between items-center h-14 gap-2">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold font-mono">MN</span>
          <span className="text-xl font-semibold hidden md:inline">
            mininjin&apos;s Tech Blog
          </span>
        </Link>

        <nav className="flex flex-1 items-center gap-2 px-4">
          <Route href="/posts" selected={pathname.startsWith("/posts")}>
            Blog
          </Route>
          <Route href="/about" selected={pathname.startsWith("/about")}>
            About
          </Route>
        </nav>

        <nav className="flex items-center">
          <a
            href="https://github.com/mininjin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center cursor-pointer"
          >
            <Button variant="ghost" size="icon">
              <BsGithub size={20} />
            </Button>
          </a>

          <a
            href="https://x.com/0ta_Utan"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center cursor-pointer"
          >
            <Button variant="ghost" size="icon">
              <BsTwitterX size={20} />
            </Button>
          </a>
        </nav>

        <ModeToggle />
      </div>
    </header>
  );
}

const Route = (props: {
  href: string;
  children: React.ReactNode;
  selected?: boolean;
}) => (
  <Link
    href={props.href}
    className={`flex items-center justify-center cursor-pointer rounded-md px-2 text-sm ${
      props.selected
        ? "text-foreground font-bold"
        : "text-foreground/80 font-medium"
    }`}
  >
    {props.children}
  </Link>
);

const ModeToggle = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <BsSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <BsMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

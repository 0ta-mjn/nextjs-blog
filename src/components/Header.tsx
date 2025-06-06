"use client";

import { useTheme } from "next-themes";
import { BsGithub, BsTwitterX } from "react-icons/bs";
import { Button } from "./ui/button";
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  GITHUB_ACCOUNT_URL,
  TWITTER_ACCOUNT_URL,
  USERNAME_SHORT,
} from "@/const";
import Logo from "./logo.svg";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Languages, Moon, Sun } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { useTranslations } from "next-intl";

export default function Header() {
  const pathname = usePathname();
  const t = useTranslations("Metadata");

  return (
    <header className="flex w-full items-center justify-center px-4 sticky top-0 z-50 bg-header/60 backdrop-blur border-b border-b-muted">
      <div className="container flex justify-between items-center h-14 gap-2">
        <Link href="/" className="flex items-center gap-4">
          <div className="flex items-center justify-center p-1.5 rounded-lg bg-stone-700 dark:bg-stone-200">
            <Logo
              width={24}
              height={24}
              fill="currentColor"
              className="text-background"
            />
          </div>

          <span className="text-xl font-semibold hidden md:inline">
            {t("homeTitle", {
              username: USERNAME_SHORT,
            })}
          </span>
        </Link>

        <nav className="flex flex-1 items-center gap-2 px-4">
          <Route href={`/blog`} selected={pathname.includes("/blog")}>
            Blog
          </Route>
          <Route href={`/about`} selected={pathname.includes("/about")}>
            About
          </Route>
        </nav>

        <nav className="flex items-center">
          <a
            href={GITHUB_ACCOUNT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center cursor-pointer"
          >
            <Button variant="ghost" size="icon">
              <BsGithub size={20} />
            </Button>
          </a>

          <a
            href={TWITTER_ACCOUNT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center cursor-pointer"
          >
            <Button variant="ghost" size="icon">
              <BsTwitterX size={20} />
            </Button>
          </a>
        </nav>

        <LocaleToggle />

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

const LocaleToggle = () => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const setLocale = useCallback(
    (locale: string) => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        { pathname, params },
        { locale }
      );
    },
    [pathname, params, router]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="size-[1.2rem]" />
          <span className="sr-only">Toggle locale</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLocale("en")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocale("ja")}>
          日本語
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ModeToggle = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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

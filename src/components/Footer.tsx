import { GITHUB_REPO_URL, USERNAME } from "@/const";

export default function Footer() {
  return (
    <footer className="border-grid flex items-center justify-center border-t px-2 md:px-0">
      <div className="container flex items-center py-4 flex-col md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} {USERNAME}
        </p>

        <div className="flex-1"></div>

        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-right">
          The source code is available on{" "}
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}

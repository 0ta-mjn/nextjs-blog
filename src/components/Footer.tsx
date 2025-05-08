import React from "react";

const Footer = () => {
  return (
    <footer className="border-grid flex items-center justify-center border-t px-2 md:px-0">
      <div className="container flex items-center py-4 flex-col md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} mininjin
        </p>

        <div className="flex-1"></div>

        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-right">
          The source code is available on{" "}
          <a
            href="https://github.com/mininjin/nextjs-blog"
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
};

export default Footer;

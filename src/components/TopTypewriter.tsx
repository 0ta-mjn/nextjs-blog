"use client";

import { GITHUB_REPO_URL, USERNAME } from "@/const";
import { useState, useEffect, useMemo } from "react";

const FIRST_TEXT = `This   is   a   blog   and   portfolio   site   built   by   ${USERNAME}   using   Next.js.`;
const SECOND_TEXT = "You   can   find   the   source   code   on   ";
const GITHUB_TEXT = "GitHub";
const FIRST_DELAY = 1000;
const TYPE_SPEED = 30;
const WAIT_FOR_NEXT = 1000;

export default function TopTypewriter() {
  const [firstVisible, setFirstVisible] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [secondVisible, setSecondVisible] = useState("");
  const [githubVisible, setGithubVisible] = useState("");

  // Effect to handle the typewriter effect for the first text
  useEffect(() => {
    let idx = 0;
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setFirstVisible(FIRST_TEXT.slice(0, ++idx));
        if (idx === FIRST_TEXT.length) {
          clearInterval(interval);
          setIsWaiting(true);
          setTimeout(() => {
            setIsWaiting(false);
            let secondIdx = 0;
            const secondInterval = setInterval(() => {
              setSecondVisible(SECOND_TEXT.slice(0, ++secondIdx));
              if (secondIdx === SECOND_TEXT.length) {
                clearInterval(secondInterval);
                let githubIdx = 0;
                const githubInterval = setInterval(() => {
                  setGithubVisible(GITHUB_TEXT.slice(0, ++githubIdx));
                  if (githubIdx === GITHUB_TEXT.length) {
                    clearInterval(githubInterval);
                  }
                }, TYPE_SPEED);
              }
            }, TYPE_SPEED);
          }, WAIT_FOR_NEXT);
        }
      }, TYPE_SPEED);
    }, FIRST_DELAY);
    return () => clearTimeout(startTimer);
  }, []);

  const isEndFirst = useMemo(
    () => firstVisible.length === FIRST_TEXT.length,
    [firstVisible]
  );
  const isEndSecond = useMemo(
    () =>
      secondVisible.length === SECOND_TEXT.length &&
      githubVisible.length === GITHUB_TEXT.length,
    [githubVisible.length, secondVisible.length]
  );

  return (
    <div className="flex flex-col items-center gap-3 text-xl text-muted-foreground">
      <div className="flex items-center justify-center gap-2">
        <p>{firstVisible}</p>

        {(!isEndFirst || isWaiting) && TypingBar}
      </div>

      <div className="flex items-center justify-center gap-2">
        <p>
          {secondVisible}{" "}
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {githubVisible}
          </a>
          {isEndSecond && <>.</>}
        </p>

        {!isEndSecond && isEndFirst && !isWaiting && TypingBar}
      </div>
    </div>
  );
}

const TypingBar = (
  <div className="bg-foreground h-[1.414rem] w-[2px] animate-typing-blink" />
);

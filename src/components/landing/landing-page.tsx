"use client";

import React, { useEffect } from "react";
import { Github } from "lucide-react";
import { Button } from "../ui/button";
import { WordRotate } from "../magicui/word-rotate";
import { AnimatedGradientText } from "../magicui/animated-gradient-text";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useGithub } from "@/hooks/use-github-count";

export const LandingPage = () => {
  const { stargazers_count } = useGithub();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full relative max-w-[1100px] mx-auto min-h-screen pt-[var(--header-height)]">
      <header className="fixed top-4 left-4 right-4 sm:left-0 sm:right-0 z-50">
        <div className="max-w-6xl mx-auto backdrop-blur-lg border shadow-xl rounded-none py-2 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 md:h-16">
            <div className="flex space-x-3 items-center">
              <span className="text-xl sm:text-2xl font-bold bg-clip-text">
                DevNotify
              </span>
            </div>
            <Button
              variant="outline"
              className="shadow-lg rounded-none bg-blue-700/90 hover:bg-blue-700/60 flex hover:shadow-xl transform hover:scale-105 cursor-pointer transition-all duration-300 text-xs sm:text-sm"
            >
              <Link
                href={"https://github.com/Surajsuthar/dev-notify"}
                target="_blank"
                className="p-1 flex space-x-2 items-center"
              >
                <Github className="w-4 h-4" />
                <p>{stargazers_count}</p>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="py-20 px-2 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center min-h-64 gap-8 lg:gap-0">
            <div className="flex flex-col gap-2.5 justify-center items-center lg:items-start text-center lg:text-left">
              <AnimatedGradientText className="text-xs sm:text-sm border p-2.5 rounded-xl font-medium">
                Hello, contributor
              </AnimatedGradientText>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                Dev Notify
              </h1>
              <WordRotate
                duration={1700}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                words={["Track.", "Notify.", "Contribute."]}
              />
            </div>
            <div className="flex flex-col items-center lg:items-start">
              <p className="text-center lg:text-left text-muted-foreground text-base sm:text-lg leading-relaxed max-w-md mx-auto lg:ml-auto mb-4">
                DevNotify is a platform that allows you to track your starred
                repositories and issues.
              </p>
              <Button
                className="cursor-pointer rounded-none flex gap-2 w-full sm:w-auto"
                onClick={() =>
                  signIn("github", {
                    callbackUrl: "/app",
                    redirect: true,
                  })
                }
              >
                <span className="hidden sm:inline">Sign Up With Github</span>
                <span className="sm:hidden">Sign Up</span>
                <Github className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 px-2 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative group">
            <div className="border aspect-video shadow-2xl rounded-none flex items-center justify-center relative overflow-hidden">
              <Image
                src="/landing-page.png"
                alt="DevNotify App Dashboard"
                width={800}
                height={450}
                className="w-full h-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="relative p-2 flex flex-col space-y-2.5 h-[200px] sm:h-[300px] px-4">
        <div className="absolute bottom-0 right-0 text-[80px] sm:text-[120px] lg:text-[170px] bg-gradient-to-b from-white to-black bg-clip-text text-transparent font-extrabold opacity-10 leading-none">
          <span className="block sm:hidden">
            DEV
            <br />
            NOTIFY
          </span>
          <span className="hidden sm:block">DEV NOTIFY</span>
        </div>
        <div className="flex items-center space-x-2.5 relative z-10">
          <span className="text-lg sm:text-xl font-bold">Build in public</span>
          <Link
            href="https://github.com/Surajsuthar/dev-notify"
            target="_blank"
            className=""
          >
            <Github className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
        </div>
        <Link
          href="https://x.com/Suraj__0067"
          target="_blank"
          className="text-foreground relative z-10 text-sm sm:text-base"
        >
          @Suraj__0067
        </Link>
      </footer>
    </main>
  );
};

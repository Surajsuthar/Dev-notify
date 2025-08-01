"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY!;
const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("PostHog: Skipping in development mode");
      return;
    }

    if (!posthogKey) {
      console.error("PostHog: NEXT_PUBLIC_POSTHOG_KEY is not set");
      return;
    }

    posthog.init(posthogKey, {
      api_host: posthogHost,
      person_profiles: "identified_only",
      defaults: "2025-05-24",
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

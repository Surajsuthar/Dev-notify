import type { NextAuthConfig } from "next-auth";
import Github from "next-auth/providers/github";

export default {
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email repo public_repo admin:repo_hook",
        },
      },
    }),
  ],
} satisfies NextAuthConfig;

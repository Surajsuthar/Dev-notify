import NextAuth, { User, type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      accessToken: string;
      githubId: string;
      githubLogin: string;
    };
  }
}

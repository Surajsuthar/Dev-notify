import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken: string;
      githubId: string
      githubLogin: string
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    githubId: string;
    githubLogin: string
  }
}
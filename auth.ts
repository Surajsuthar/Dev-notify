import NextAuth from "next-auth";
import { db } from "@/lib/prisma";
import authConfig from "@/lib/auth.config";

const MAX_COOKIE_AGE = 8 * 60 * 60;

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token!;
        token.githubId = account.providerAccountId!;
        token.githubLogin = account.githubLogin
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.accessToken = token.accessToken as string;
        session.user.githubId = token.githubId as string
        session.user.githubLogin = token.githubLogin as string
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" && profile) {
        const githubId = account.providerAccountId;
        const githubLogin = (profile as any).login;
        const name = user.name ?? githubLogin;
        const image = user.image ?? (profile as any).avatar_url;
        try {
          await db.user.upsert({
            where: { githubId },
            update: {
              githubLogin,
              name,
              image,
              email: user.email ?? null,
            },
            create: {
              githubId,
              name,
              image,
              email: user.email ?? null,
              githubLogin
            },
          });
        } catch (error) {
          console.error("Database error during sign in:", error);
          return false;
        }
      }
      return true;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: MAX_COOKIE_AGE,
  },
  pages: {
    signIn: "/"
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});
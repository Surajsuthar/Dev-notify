import authConfig from "@/lib/auth.config"
import { db } from "@/lib/prisma"
import NextAuth from "next-auth"
 
const MAX_COOKIE_AGE = 30 * 24 * 60 * 60

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account && profile) {
        token.accessToken = account.access_token
        token.githubId = profile.id
        token.githubLogin = profile.login
        token.profile = profile

        if (user) {
          token.userId = user.id
          token.userEmail = user.email
          token.userName = user.name
          token.userImage = user.image
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.userId as string
        session.user.accessToken = token.accessToken as string
        session.user.githubId = token.githubId as string
        session.user.githubLogin = token.githubLogin as string
        session.user.email = token.userEmail as string
        session.user.name = token.userName as string
        session.user.image = token.userImage as string
      }
      return session
    },
    async signIn({ user, account }) {
      if (account?.provider === "github" && user.email) {
        try {
          await db.user.upsert({
            where: { email: user.email },
            update: {
              githubId: account.providerAccountId,
              name: user.name,
              image: user.image,
            },
            create: {
              name: user.name,
              email: user.email,
              image: user.image,
              githubId: account.providerAccountId
            }
          })
        } catch (error) {
          console.error("Database error during sign in:", error)
        }
      }
      return true
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: MAX_COOKIE_AGE
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development"
})
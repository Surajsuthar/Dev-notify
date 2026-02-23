import type { NextAuthConfig } from "next-auth";
import Github from "next-auth/providers/github";

export default {
	providers: [
		Github({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
			authorization: {
				params: {
					scope: "read:user user:email",
				},
			},
		}),
	],
	session: {
		strategy: "jwt",
		maxAge: 8 * 60 * 60,
	},
	pages: {
		signIn: "/",
	},
	callbacks: {
		async jwt({ token, account, profile }) {
			if (account) {
				token.accessToken = account.access_token!;
				token.githubId = account.providerAccountId!;
				token.githubLogin = (profile as any)?.login;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user && token) {
				session.user.accessToken = token.accessToken as string;
				session.user.githubId = token.githubId as string;
				session.user.githubLogin = token.githubLogin as string;
			}
			return session;
		},
	},
} satisfies NextAuthConfig;
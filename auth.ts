import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";
import { db } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
	...authConfig,
	callbacks: {
		...authConfig.callbacks,
		async signIn({ user, account, profile }) {
			if (account?.provider === "github" && profile) {
				const githubId = account.providerAccountId;
				const githubLogin = (profile as any).login;
				const name = user.name ?? githubLogin;
				const image = user.image ?? (profile as any).avatar_url;
				try {
					await db.user.upsert({
						where: { githubId },
						update: { githubLogin, name, image, email: user.email ?? null },
						create: {
							githubId,
							name,
							image,
							email: user.email ?? null,
							githubLogin,
						},
					});
				} catch (error) {
					console.error("Database error during sign in:", error);
					return false;
				}
			}
			return true;
		},
	},
	secret: process.env.AUTH_SECRET,
	debug: process.env.NODE_ENV === "development",
});

import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
	const { nextUrl } = req;
	const isLogged = !!req.auth;

	const isProtectedRoute = nextUrl.pathname.startsWith("/app");
	if (!isLogged && isProtectedRoute) {
		return Response.redirect(new URL("/", nextUrl));
	}

	const isAuthPage = nextUrl.pathname === "/";
	if (isLogged && isAuthPage) {
		return Response.redirect(new URL("/app", nextUrl));
	}
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
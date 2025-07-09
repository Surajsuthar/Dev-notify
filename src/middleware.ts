import { NextResponse } from "next/server"
import { auth } from "../auth"


export default auth((req) => {
    const { nextUrl } = req
    const isLogged = !!req.auth;

    const protectedRoutes = ['/app']
    const isProtectedRoute = protectedRoutes.some(route => 
        nextUrl.pathname.startsWith(route)
    )

    if (!isLogged && isProtectedRoute) {
        return NextResponse.redirect(new URL('/', nextUrl))
    }

    const authPages = ['/']
    const isAuthPage = authPages.includes(nextUrl.pathname)
    
    if (isLogged && isAuthPage) {
        return NextResponse.redirect(new URL('/app', nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    matcher : ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
}
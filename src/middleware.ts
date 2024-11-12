import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


//1.logic part
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPublicPath = path === "/login" || path === "/signup"
  const token = request.cookies.get("token")?.value || ""

  if (isPublicPath && token) {//authenticated users
    return NextResponse.redirect(new URL("/customer/home", request.nextUrl))
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl))
  }
}


//2.Matching part
export const config = {
  matcher: [
    '/',
    '/profile',
    '/login',
    '/signup'
  ]
}
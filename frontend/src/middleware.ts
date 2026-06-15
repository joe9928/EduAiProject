// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PREFIXES = ['/dashboard']
const IS_DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE ==='true'

export function middleware(request: NextRequest) {

  if(IS_DEV_MODE){
    return NextResponse.next()
  }
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  )

  if (!isProtected) return NextResponse.next()

  // Cast wide net — accept any cookie that looks like a refresh token
  // Update REFRESH_COOKIE_NAME once confirmed from DevTools
  const allCookies       = request.cookies.getAll()
  const hasRefreshCookie = allCookies.some((c) => {
    const name = c.name.toLowerCase()
    return (
      name.includes('refresh') ||
      name.includes('token')   ||
      name === 'sid'           ||
      name === 'session'
    )
  })

  if (!hasRefreshCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
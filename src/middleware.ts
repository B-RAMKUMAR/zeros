import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('currentUser')?.value
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/dashboard') && !currentUser) {
    request.nextUrl.pathname = '/login'
    return NextResponse.redirect(request.nextUrl)
  }

  if (pathname.startsWith('/login') && currentUser) {
    request.nextUrl.pathname = '/dashboard'
    return NextResponse.redirect(request.nextUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    if (pathname.startsWith('/app') && !token?.tenantId) {
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }

    if (pathname.startsWith('/onboarding') && token?.tenantId) {
      return NextResponse.redirect(new URL('/app', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/app/:path*', '/onboarding'],
}

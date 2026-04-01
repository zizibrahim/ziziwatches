import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
});

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin routes — check for NextAuth session token
  const isAdminRoute = /^\/[a-z]{2}\/admin/.test(pathname);
  if (isAdminRoute) {
    const token =
      req.cookies.get("next-auth.session-token") ??
      req.cookies.get("__Secure-next-auth.session-token");
    if (!token) {
      const locale = pathname.split("/")[1] || defaultLocale;
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login`, req.url)
      );
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};

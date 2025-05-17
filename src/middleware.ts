import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname, searchParams } = request.nextUrl;

  const publicRoutes = new Set([
    "/auth/login",
    "/google/callback",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/email-confirmation",
    "/auth/password-reset-confirmation",
    "/password-reset",
    "/landing",
    "/blog",
    "/guides",
    "/terms-and-privacy",
  ]);

  const privateRoutes = new Set([
    "/",
    "/profile",
    "/subaccounts",
    "/subscriptions",
    "/referal",
    "/progress",
    "/suggest-guide",
    "/favorites",
    // "/store",
  ]);

  const dynamicPublicRoutes = [
    /^\/blog\/[a-zA-Z0-9_-]+$/,
    /^\/password-reset\/[a-zA-Z0-9]+(\?.*)?$/,
  ];

  const dynamicPrivateRoutes = [
    /^\/guides\/[a-zA-Z0-9_-]+$/,
    /^\/favorites\/.+$/,
    // /^\/store\/.+$/,
  ];

  const isPublicRoute =
    pathname.includes("verify-email") ||
    pathname.includes("password-reset") ||
    publicRoutes.has(pathname) ||
    dynamicPublicRoutes.some((pattern) => pattern.test(pathname));

  const isPrivateRoute =
    privateRoutes.has(pathname) ||
    dynamicPrivateRoutes.some((pattern) => pattern.test(pathname));

  if (!token) {
    const redirectParam =
      searchParams.get("refer") || searchParams.get("mainaccount");
    if (redirectParam && pathname !== "/auth/sign-up") {
      return NextResponse.redirect(
        new URL(
          `/auth/sign-up?${searchParams.get("refer") ? "refer" : "mainaccount"}=${redirectParam}`,
          request.url,
        ),
      );
    }

    if (!isPublicRoute) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  if (token && pathname.includes("auth")) {
    return NextResponse.redirect(new URL("/guides", request.url));
  }

  if (token && !isPublicRoute && !isPrivateRoute && pathname !== "/not-found") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};

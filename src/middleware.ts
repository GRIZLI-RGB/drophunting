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
    "/store",
  ]);

  const dynamicPrivateRoutes = [
    /^\/blog\/[a-zA-Z0-9_-]+$/,
    /^\/guides\/[a-zA-Z0-9_-]+$/,
    /^\/favorites\/.+$/,
    /^\/store\/.+$/,
  ];

  const isPublicRoute = publicRoutes.has(pathname);

  const isPrivateRoute =
    privateRoutes.has(pathname) ||
    dynamicPrivateRoutes.some((pattern) => pattern.test(pathname));

  if (!token) {
    const redirectParam =
      searchParams.get("refer") || searchParams.get("mainaccount");
    if (redirectParam) {
      return NextResponse.redirect(
        new URL(`/auth/sign-up?${redirectParam}`, request.url),
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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

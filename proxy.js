import { NextResponse } from "next/server";

export function proxy(request) {
  const pathname = request.nextUrl.pathname;

  const authCookie = request.cookies.get("admin-auth");
  const isLoggedIn = authCookie?.value === "true";

  if (
    pathname.startsWith("/admin") &&
    pathname !== "/admin/login" &&
    !isLoggedIn
  ) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  if (
    pathname === "/admin/login" &&
    isLoggedIn
  ) {
    return NextResponse.redirect(
      new URL("/admin/cms/page-builder", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
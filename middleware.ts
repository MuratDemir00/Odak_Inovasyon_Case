import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const auth = req.cookies.get("auth")?.value;

  const isLoginPage = req.nextUrl.pathname.startsWith("/login");
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");

  if (isApiRoute) {
    return NextResponse.next();
  }

  if (isLoginPage) {
    if (auth) {
      const usersUrl = new URL("/users", req.url);
      return NextResponse.redirect(usersUrl);
    }
    return NextResponse.next();
  }

  if (!auth) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secret = process.env.NEXT_AUTH_URL;

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret });

  const isAuth = !!token;
  const isLoginPage = request.nextUrl.pathname === "/";

  if (isAuth && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isAuth && !isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

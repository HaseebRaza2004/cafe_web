import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(req) {
  const { pathname } = req.nextUrl;
  const method = req.method;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const isAdminPage = pathname.startsWith("/admin");
  const isApiRoute = pathname.startsWith("/api");

  if (!isAdminPage && !isApiRoute) {
    return NextResponse.next();
  }

  let isProtectedApi = false;

  if (isApiRoute) {
    if (
      pathname.startsWith("/api/admin/register") ||
      pathname.startsWith("/api/admin/login") ||
      pathname.startsWith("/api/admin/logout")
    ) {
      return NextResponse.next();
    }

    if (method === "GET") {
      if (
        pathname.startsWith("/api/orders") ||
        pathname.startsWith("/api/analytics")
      ) {
        isProtectedApi = true;
      }
    } else {
      if (method === "POST" && pathname === "/api/orders") {
        isProtectedApi = false;
      } else {
        isProtectedApi = true;
      }
    }
  }

  if (!isAdminPage && !isProtectedApi) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  const handleUnauthorized = () => {
    if (isProtectedApi) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin access required" },
        { status: 401 },
      );
    }

    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    const response = NextResponse.redirect(new URL("/admin/login", req.url));
    response.cookies.delete("token");
    return response;
  };

  if (!token) {
    return handleUnauthorized();
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    if (pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    return handleUnauthorized();
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};

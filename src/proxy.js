import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(req) {
  const { pathname } = req.nextUrl;

  // Define paths that are ALWAYS public (Login page & Static assets)
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Security Logic: Protect Admin Pages AND Admin API Routes
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (isAdminPage || isAdminApi) {
    const token = req.cookies.get("token")?.value;

    const handleUnauthorized = () => {
      if (isAdminApi) {
        return NextResponse.json(
          { success: false, error: "Unauthorized: Invalid or missing token" },
          { status: 401 },
        );
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    };

    if (!token) {
      return handleUnauthorized();
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      return handleUnauthorized();
    }
  }
  return NextResponse.next();
}

// Run Proxy ONLY on paths that need security checks
export const config = {
  matcher: ["/admin/:path*"],
};

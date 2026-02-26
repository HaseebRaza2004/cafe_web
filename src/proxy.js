import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(req) {
  const { pathname } = req.nextUrl;

  // 1. Instantly Allow Static Assets & Next.js Internals (Extreme Performance)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Define paths we need to protect
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (isAdminPage || isAdminApi) {
    const token = req.cookies.get("token")?.value;

    // Helper: Handles scenarios where user is NOT authorized (No token or Expired token)
    const handleUnauthorized = () => {
      if (isAdminApi) {
        return NextResponse.json(
          { success: false, error: "Unauthorized: Invalid or missing token" },
          { status: 401 }
        );
      }
      
      // Allow access if they are already heading to the login page
      if (pathname === "/admin/login") {
        return NextResponse.next();
      }

      // Otherwise, redirect to login & clear any stale cookies
      const response = NextResponse.redirect(new URL("/admin/login", req.url));
      response.cookies.delete("token"); 
      return response;
    };

    // 2. If NO token is found -> trigger unauthorized flow
    if (!token) {
      return handleUnauthorized();
    }

    // 3. If Token EXISTS -> verify it securely using 'jose' (Edge Compatible)
    try {
      await jwtVerify(token, JWT_SECRET);
      
      // ✨ THE FIX: Token is VALID and user is trying to access Login page
      if (pathname === "/admin/login") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }

      // Token is VALID and user is accessing normal protected routes -> Allow
      return NextResponse.next();

    } catch (error) {
      // Token verification failed (Expired or Tampered) -> trigger unauthorized flow
      return handleUnauthorized();
    }
  }

  return NextResponse.next();
}

// Run Proxy ONLY on paths that strictly need security checks (Optimized Routing)
export const config = {
  matcher: [
    "/admin/:path*", 
    // "/api/admin/:path*"
  ],
};
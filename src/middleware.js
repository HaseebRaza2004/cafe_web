import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Secret Key ko Edge-compatible format mein convert karna
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET
);

export async function middleware(req) {
  // 1. Current Path check karein
  const path = req.nextUrl.pathname;

  // 2. Agar user Login page par hai ya API call hai, to jane do
  // Static files (_next, images) ko bhi ignore karo taake speed slow na ho
  if (
    path.startsWith("/_next") || 
    path.startsWith("/api") || 
    path === "/admin/login" ||
    path.startsWith("/static") ||
    path.includes(".") // Images/CSS waghaira
  ) {
    return NextResponse.next();
  }

  // 3. Sirf /admin wale routes protect karne hain
  if (path.startsWith("/admin")) {
    const token = req.cookies.get("token")?.value;

    // Agar Token nahi hai -> Login par bhejo
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      // Token Verify karo (Edge Fast Verification)
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next(); // Sab theek hai, jane do
    } catch (error) {
      // Agar token expired ya fake hai
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

// Optimization: Middleware sirf in paths par chalega
export const config = {
  matcher: ["/admin/:path*"],
};
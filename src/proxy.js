import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const PUBLIC_API_RULES = [
  { path: "/api/admin/login", methods: ["POST"] },
  { path: "/api/admin/logout", methods: ["POST"] },
  { path: "/api/admin/register", methods: ["POST"] },
  { path: "/api/orders", methods: ["POST"] },
  { path: "/api/orders/", methods: ["GET"], dynamic: true },
  { path: "/api/settings", methods: ["GET"] },
  { path: "/api/products", methods: ["GET"] },
  { path: "/api/categories", methods: ["GET"] },
  { path: "/api/deals", methods: ["GET"] },
  { path: "/api/option-groups", methods: ["GET"] },
  { path: "/api/products/", methods: ["GET"], dynamic: true },
  { path: "/api/categories/", methods: ["GET"], dynamic: true },
  { path: "/api/deals/", methods: ["GET"], dynamic: true },
  { path: "/api/option-groups/", methods: ["GET"], dynamic: true },
];

function isPublicApiRequest(pathname, method) {
  for (const rule of PUBLIC_API_RULES) {
    let matches = false;

    if (rule.dynamic) {
      matches = pathname.startsWith(rule.path);
    } else {
      matches = pathname === rule.path;
    }

    if (matches && rule.methods.includes(method)) {
      return true;
    }
  }
  return false;
}

async function verifyToken(token) {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

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

  if (isApiRoute && isPublicApiRequest(pathname, method)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return handleUnauthorized(req, isApiRoute, pathname);
  }

  const valid = await verifyToken(token);
  if (!valid) {
    return handleUnauthorized(req, isApiRoute, pathname);
  }

  if (pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

function handleUnauthorized(req, isApiRoute, pathname) {
  if (isApiRoute) {
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
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest): NextResponse {
  const response = NextResponse.next();

  // ── Security headers ─────────────────────────────────────────────────────
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin"
  );
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // ── CSRF-lite: block cross-origin non-GET API requests ───────────────────
  // For non-GET API requests that include an Origin header, verify that the
  // origin host matches the request host. This mitigates simple CSRF without
  // requiring a token for this cookie-based trial system.
  const method = request.method;
  const isApiRoute = request.nextUrl.pathname.startsWith("/api/");

  if (isApiRoute && method !== "GET" && method !== "HEAD") {
    const origin = request.headers.get("origin");
    if (origin) {
      try {
        const originHost = new URL(origin).host;
        const requestHost = request.headers.get("host") ?? "";
        if (originHost !== requestHost) {
          return NextResponse.json(
            { error: "Cross-origin request blocked" },
            { status: 403 }
          );
        }
      } catch {
        // Malformed Origin header — block the request
        return NextResponse.json(
          { error: "Invalid origin" },
          { status: 403 }
        );
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

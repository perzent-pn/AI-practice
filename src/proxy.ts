import { NextRequest, NextResponse } from "next/server";

/**
 * Security Proxy (Next.js 16)
 *
 * ใส่ Security Headers ให้ทุก request:
 * - Content-Security-Policy (CSP)
 * - X-Content-Type-Options
 * - X-Frame-Options
 * - X-XSS-Protection
 * - Referrer-Policy
 * - Strict-Transport-Security (HSTS)
 * - Permissions-Policy
 */
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  // ==========================================================================
  // Content-Security-Policy
  // ==========================================================================
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""};
    style-src 'self'${isDev ? " 'unsafe-inline'" : ` 'nonce-${nonce}'`};
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self'${isDev ? " ws://localhost:* http://localhost:*" : ""};
    upgrade-insecure-requests;
  `;

  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  // ==========================================================================
  // Request Headers
  // ==========================================================================
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );

  // ==========================================================================
  // Response Headers
  // ==========================================================================
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // CSP
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );

  // ป้องกัน MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // ป้องกัน clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // Legacy XSS protection (สำหรับ browser เก่า)
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // ควบคุม Referrer
  response.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin"
  );

  // บังคับ HTTPS (2 ปี + subdomains + preload)
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // จำกัด browser features ที่ไม่ได้ใช้
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  );

  return response;
}

/**
 * Matcher — ไม่ apply security headers กับ static assets
 */
export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

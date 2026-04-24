/**
 * Security Helpers
 *
 * Pure utility functions สำหรับ security operations
 * ใช้ได้ทั้ง Server Components และ Server Actions
 */

// =============================================================================
// Input Sanitization
// =============================================================================

/**
 * ลบ HTML tags ออกจาก string เพื่อป้องกัน XSS
 * ใช้สำหรับ user-generated content ที่จะแสดงเป็น text
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * ลบ special characters ที่อาจเป็นอันตราย
 * ใช้สำหรับ filenames, slugs, etc.
 */
export function sanitizeString(input: string): string {
  return input.replace(/[^\w\s.-]/gi, "").trim();
}

// =============================================================================
// Rate Limiting (In-Memory — สำหรับ dev/small scale)
// =============================================================================

const rateLimitMap = new Map<
  string,
  { count: number; lastReset: number }
>();

/**
 * Simple in-memory rate limiter
 *
 * @param identifier - IP address, user ID, etc.
 * @param maxRequests - จำนวน request สูงสุดต่อ window
 * @param windowMs - ขนาดของ time window (ms)
 * @returns true ถ้าถูก rate limit (ต้อง block)
 */
export function isRateLimited(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60_000
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now - record.lastReset > windowMs) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now });
    return false;
  }

  record.count++;

  if (record.count > maxRequests) {
    return true;
  }

  return false;
}

// =============================================================================
// Validation Helpers
// =============================================================================

/**
 * ตรวจว่า string เป็น email format ที่ถูกต้อง
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * ตรวจว่า password มีความแข็งแรงเพียงพอ
 * - อย่างน้อย 8 ตัวอักษร
 * - มีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว
 * - มีตัวเลขอย่างน้อย 1 ตัว
 */
export function isStrongPassword(password: string): boolean {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
}

/**
 * Mask sensitive data สำหรับ logging
 * เช่น email@example.com → em***@example.com
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***";
  const masked = local.slice(0, 2) + "***";
  return `${masked}@${domain}`;
}

/**
 * Mask sensitive string
 * เช่น "1234567890" → "12****7890"
 */
export function maskString(
  str: string,
  visibleStart: number = 2,
  visibleEnd: number = 4
): string {
  if (str.length <= visibleStart + visibleEnd) return "****";
  const start = str.slice(0, visibleStart);
  const end = str.slice(-visibleEnd);
  return `${start}****${end}`;
}

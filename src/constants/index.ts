/**
 * App-wide Constants
 *
 * รวมค่าคงที่ทั้งหมดของแอป — import จากที่นี่ที่เดียว
 * ห้ามใช้ magic strings/numbers ใน codebase
 */

export const APP_NAME = "AI Practice";
export const APP_DESCRIPTION = "AI Prompting Competition Project";

/**
 * Navigation items สำหรับ Sidebar/Navbar
 */
export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
] as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 10,
  MAX_PER_PAGE: 100,
} as const;

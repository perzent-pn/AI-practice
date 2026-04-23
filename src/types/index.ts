/**
 * Shared TypeScript Type Definitions
 *
 * รวม common types ที่ใช้ทั่วทั้งแอป
 * สำหรับ feature-specific types ให้สร้างไฟล์แยกใน types/[feature-name].ts
 */

/**
 * Standard Server Action response
 * ใช้เป็น return type ของทุก Server Action เพื่อให้ Frontend handle ได้สม่ำเสมอ
 */
export type ActionResponse<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Pagination metadata
 */
export type PaginationMeta = {
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalCount: number;
};

/**
 * Paginated response wrapper
 */
export type PaginatedResponse<T> = {
  items: T[];
  meta: PaginationMeta;
};

/**
 * Common ID param for dynamic routes
 */
export type IdParam = {
  params: Promise<{ id: string }>;
};

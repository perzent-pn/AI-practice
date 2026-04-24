/**
 * API Client Configuration
 *
 * Central API client สำหรับเรียก external APIs จากฝั่ง Frontend
 * ใช้ native fetch แต่ wrap ด้วย type-safe helpers
 *
 * ใช้เมื่อ:
 * - ต้องเรียก external APIs (3rd party services)
 * - ต้องเรียก Next.js API routes (ถ้ามี)
 * - ต้องการ centralized error handling + auth headers
 *
 * ไม่ใช้เมื่อ:
 * - Database operations → ใช้ Server Actions แทน
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

type RequestOptions = {
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

/**
 * Type-safe API response wrapper
 */
type ApiResponse<T> = {
  data: T;
  status: number;
};

/**
 * Custom API Error
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body?: unknown
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = "ApiError";
  }
}

/**
 * Base fetch wrapper with error handling
 */
async function baseFetch<T>(
  endpoint: string,
  init: RequestInit,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
      ...options?.headers,
    },
    signal: options?.signal,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, response.statusText, body);
  }

  const data = (await response.json()) as T;
  return { data, status: response.status };
}

/**
 * GET request
 */
export async function apiGet<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return baseFetch<T>(endpoint, { method: "GET" }, options);
}

/**
 * POST request
 */
export async function apiPost<T>(
  endpoint: string,
  body: unknown,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return baseFetch<T>(
    endpoint,
    { method: "POST", body: JSON.stringify(body) },
    options
  );
}

/**
 * PUT request
 */
export async function apiPut<T>(
  endpoint: string,
  body: unknown,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return baseFetch<T>(
    endpoint,
    { method: "PUT", body: JSON.stringify(body) },
    options
  );
}

/**
 * PATCH request
 */
export async function apiPatch<T>(
  endpoint: string,
  body: unknown,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return baseFetch<T>(
    endpoint,
    { method: "PATCH", body: JSON.stringify(body) },
    options
  );
}

/**
 * DELETE request
 */
export async function apiDelete<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return baseFetch<T>(endpoint, { method: "DELETE" }, options);
}

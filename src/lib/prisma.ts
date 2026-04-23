import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

/**
 * Prisma Client Singleton (Prisma 7 + libSQL adapter)
 *
 * Prisma 7 ต้องใช้ adapter pattern สำหรับ SQLite
 * ใช้ @prisma/adapter-libsql เป็น driver adapter
 *
 * ป้องกันการสร้าง PrismaClient หลาย instance ตอน Next.js hot reload
 * ใน development mode — ใช้ global variable เก็บ instance ไว้
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  });

  return new PrismaClient({ adapter }) as unknown as PrismaClient;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

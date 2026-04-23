/**
 * Auth.js v5 Configuration
 *
 * เตรียมไว้พร้อมใช้งาน — Activate เมื่อต้องการ auth
 * ใช้ PrismaAdapter เชื่อมกับ SQLite ผ่าน Prisma
 *
 * วิธี Activate:
 * 1. Uncomment code ด้านล่าง
 * 2. สร้าง src/app/api/auth/[...nextauth]/route.ts
 * 3. เพิ่ม AUTH_SECRET ใน .env
 * 4. เพิ่ม Provider ที่ต้องการ (GitHub, Google, Credentials, etc.)
 */

// import NextAuth from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { prisma } from "@/lib/prisma";
//
// export const { handlers, auth, signIn, signOut } = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     // เพิ่ม providers ที่ต้องการที่นี่
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   pages: {
//     signIn: "/login",
//   },
// });

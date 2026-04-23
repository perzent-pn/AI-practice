/**
 * Auth Layout
 *
 * Layout สำหรับ route group (auth) — login, register
 * แสดงแบบ centered, ไม่มี sidebar/navbar
 */
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}

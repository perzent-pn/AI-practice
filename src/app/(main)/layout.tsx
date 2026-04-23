/**
 * Main Layout
 *
 * Layout สำหรับ route group (main) — dashboard, features ต่างๆ
 * จะมี sidebar/navbar ในอนาคต
 */
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* TODO: Navbar component */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <span className="font-semibold">AI Practice</span>
        </div>
      </header>

      <main className="container flex-1 py-6">{children}</main>

      {/* TODO: Footer component */}
    </div>
  );
}

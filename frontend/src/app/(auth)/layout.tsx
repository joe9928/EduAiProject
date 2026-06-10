// src/app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Intentionally minimal — no Navbar, no Footer
  // The login/register pages are self-contained
  return <>{children}</>
}
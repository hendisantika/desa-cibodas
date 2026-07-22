import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil Desa" },
  { href: "/informasi", label: "Informasi" },
];

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-lg">
            🏡
          </span>
          <span className="text-lg font-bold text-gray-900">Desa Cibodas</span>
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition hover:text-emerald-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href={user ? "/dashboard" : "/login"}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          {user ? "Dashboard" : "Masuk"}
        </Link>
      </div>
    </header>
  );
}

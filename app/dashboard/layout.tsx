import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";

export const metadata: Metadata = {
  title: "Dashboard | Desa Buninagara",
};

const NAV_ITEMS = [
  { href: "/dashboard", label: "Ringkasan", icon: "📊" },
  { href: "/dashboard/profil", label: "Profil Desa", icon: "🏡" },
  { href: "/dashboard/penduduk", label: "Penduduk", icon: "👥" },
  { href: "/dashboard/informasi", label: "Informasi", icon: "📢" },
  { href: "/dashboard/galeri", label: "Galeri", icon: "🖼️" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Lapisan kedua setelah proxy: pastikan user login
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white sm:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-gray-100 px-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-lg">
            🏡
          </span>
          <span className="font-bold text-gray-900">Admin Desa</span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-emerald-50 hover:text-emerald-800"
            >
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-emerald-50 hover:text-emerald-800"
          >
            <span>🌐</span> Lihat Situs
          </Link>
        </nav>

        <div className="border-t border-gray-100 p-4">
          <p className="truncate text-xs text-gray-400">{user.email}</p>
          <form action={logout} className="mt-2">
            <button
              type="submit"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              Keluar
            </button>
          </form>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Top bar untuk layar kecil */}
        <div className="flex h-14 items-center justify-between gap-2 overflow-x-auto border-b border-gray-200 bg-white px-4 sm:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-sm font-medium text-gray-600"
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </div>

        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}

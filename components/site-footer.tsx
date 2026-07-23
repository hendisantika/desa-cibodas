import Link from "next/link";
import type { VillageProfile } from "@/lib/types";

export function SiteFooter({ profile }: { profile: VillageProfile | null }) {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="flex items-center gap-2 text-base font-bold text-gray-900">
            <span>🏡</span> {profile?.name ?? "Desa Buninagara"}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            {profile?.slogan ?? "Desa Asri, Mandiri, dan Sejahtera"}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">Navigasi</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-500">
            <li>
              <Link href="/profil" className="hover:text-emerald-700">
                Profil Desa
              </Link>
            </li>
            <li>
              <Link href="/informasi" className="hover:text-emerald-700">
                Informasi Desa
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-emerald-700">
                Login Admin
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">Kontak</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-500">
            {profile?.address && <li>📍 {profile.address}</li>}
            {profile?.phone && <li>📞 {profile.phone}</li>}
            {profile?.email && <li>✉️ {profile.email}</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Pemerintah {profile?.name ?? "Desa Buninagara"}
        . Seluruh hak cipta.
      </div>
    </footer>
  );
}

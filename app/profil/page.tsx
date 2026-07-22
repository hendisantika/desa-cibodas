import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getVillageProfile } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Profil Desa | Desa Cibodas",
  description: "Profil, sejarah, visi, dan misi Desa Cibodas",
};

export default async function ProfilPage() {
  const profile = await getVillageProfile();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <h1 className="text-3xl font-extrabold">
              Profil {profile?.name ?? "Desa Cibodas"}
            </h1>
            <p className="mt-2 text-emerald-100">{profile?.slogan}</p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl space-y-10 px-4 py-14 sm:px-6">
          <section>
            <h2 className="text-xl font-bold text-gray-900">🏡 Tentang Desa</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-gray-600">
              {profile?.description ?? "Belum ada data."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">📜 Sejarah</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-gray-600">
              {profile?.history ?? "Belum ada data."}
            </p>
          </section>

          <div className="grid gap-6 sm:grid-cols-2">
            <section className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6">
              <h2 className="text-lg font-bold text-gray-900">🎯 Visi</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-600">
                {profile?.vision ?? "Belum ada data."}
              </p>
            </section>
            <section className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6">
              <h2 className="text-lg font-bold text-gray-900">🧭 Misi</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-600">
                {profile?.mission ?? "Belum ada data."}
              </p>
            </section>
          </div>

          <section>
            <h2 className="text-xl font-bold text-gray-900">📍 Kontak & Alamat</h2>
            <ul className="mt-3 space-y-2 text-gray-600">
              {profile?.address && <li>📍 {profile.address}</li>}
              {profile?.phone && <li>📞 {profile.phone}</li>}
              {profile?.email && <li>✉️ {profile.email}</li>}
            </ul>
          </section>
        </div>
      </main>
      <SiteFooter profile={profile} />
    </>
  );
}

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  getPopulationStats,
  getPublishedInfo,
  getVillageProfile,
} from "@/lib/queries";
import {
  CATEGORY_LABELS,
  CATEGORY_STYLES,
  formatDate,
  formatNumber,
} from "@/lib/utils";

export default async function HomePage() {
  const [profile, stats, latestInfo] = await Promise.all([
    getVillageProfile(),
    getPopulationStats(),
    getPublishedInfo(3),
  ]);

  const latest = stats[0];
  const total = latest ? latest.male + latest.female : 0;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white">
          <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-emerald-200">
              Selamat Datang di Website Resmi
            </p>
            <h1 className="text-4xl font-extrabold sm:text-5xl">
              {profile?.name ?? "Desa Cibodas"}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100">
              {profile?.slogan ?? "Desa Asri, Mandiri, dan Sejahtera"}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/profil"
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 shadow transition hover:bg-emerald-50"
              >
                Profil Desa
              </Link>
              <Link
                href="/informasi"
                className="rounded-lg border border-emerald-300/60 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Informasi Desa
              </Link>
            </div>
          </div>
        </section>

        {/* Statistik Penduduk */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Statistik Penduduk{latest ? ` ${latest.year}` : ""}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            {[
              { label: "Total Penduduk", value: total, icon: "👥" },
              { label: "Laki-laki", value: latest?.male ?? 0, icon: "👨" },
              { label: "Perempuan", value: latest?.female ?? 0, icon: "👩" },
              {
                label: "Kepala Keluarga",
                value: latest?.households ?? 0,
                icon: "🏠",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm"
              >
                <div className="text-3xl">{item.icon}</div>
                <p className="mt-3 text-3xl font-extrabold text-emerald-700">
                  {formatNumber(item.value)}
                </p>
                <p className="mt-1 text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tentang Desa */}
        <section className="bg-emerald-50/60">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Tentang {profile?.name ?? "Desa Cibodas"}
              </h2>
              <p className="mt-4 leading-relaxed text-gray-600">
                {profile?.description ??
                  "Informasi profil desa belum tersedia."}
              </p>
              <Link
                href="/profil"
                className="mt-6 inline-block text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Selengkapnya →
              </Link>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900">🎯 Visi</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {profile?.vision ?? "-"}
              </p>
            </div>
          </div>
        </section>

        {/* Informasi Terbaru */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Informasi Terbaru
            </h2>
            <Link
              href="/informasi"
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Lihat semua →
            </Link>
          </div>
          {latestInfo.length === 0 ? (
            <p className="mt-8 text-sm text-gray-500">
              Belum ada informasi yang dipublikasikan.
            </p>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {latestInfo.map((info) => (
                <Link
                  key={info.id}
                  href={`/informasi/${info.id}`}
                  className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                >
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_STYLES[info.category]}`}
                  >
                    {CATEGORY_LABELS[info.category]}
                  </span>
                  <h3 className="mt-3 font-semibold text-gray-900 group-hover:text-emerald-700">
                    {info.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-500">
                    {info.content}
                  </p>
                  <p className="mt-4 text-xs text-gray-400">
                    {formatDate(info.created_at)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Peta Desa */}
        <section className="bg-gray-50">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-center text-2xl font-bold text-gray-900">
              Peta Desa
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500">
              {profile?.address ?? ""}
            </p>
            <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
              {profile?.map_embed_url ? (
                <iframe
                  src={profile.map_embed_url}
                  title="Peta Desa"
                  className="h-96 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-96 items-center justify-center bg-white text-sm text-gray-400">
                  Peta desa belum diatur.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter profile={profile} />
    </>
  );
}

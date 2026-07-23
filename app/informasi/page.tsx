import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getPublishedInfo, getVillageProfile } from "@/lib/queries";
import {
  CATEGORY_LABELS,
  CATEGORY_STYLES,
  formatDate,
} from "@/lib/utils";

export const metadata: Metadata = {
  title: "Informasi | Desa Buninagara",
  description: "Pengumuman, berita, kegiatan, dan layanan Desa Buninagara",
};

export default async function InformasiPage() {
  const [profile, infoList] = await Promise.all([
    getVillageProfile(),
    getPublishedInfo(),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <h1 className="text-3xl font-extrabold">Informasi Desa</h1>
            <p className="mt-2 text-emerald-100">
              Pengumuman, berita, kegiatan, dan layanan terbaru
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
          {infoList.length === 0 ? (
            <p className="text-sm text-gray-500">
              Belum ada informasi yang dipublikasikan.
            </p>
          ) : (
            <div className="space-y-5">
              {infoList.map((info) => (
                <Link
                  key={info.id}
                  href={`/informasi/${info.id}`}
                  className="group block rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_STYLES[info.category]}`}
                    >
                      {CATEGORY_LABELS[info.category]}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(info.created_at)}
                    </span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-emerald-700">
                    {info.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
                    {info.content}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter profile={profile} />
    </>
  );
}

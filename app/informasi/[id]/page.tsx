import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getInfoById, getVillageProfile } from "@/lib/queries";
import {
  CATEGORY_LABELS,
  CATEGORY_STYLES,
  formatDate,
} from "@/lib/utils";

export default async function InformasiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [profile, info] = await Promise.all([
    getVillageProfile(),
    getInfoById(id),
  ]);

  if (!info || !info.published) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <Link
            href="/informasi"
            className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            ← Kembali ke daftar informasi
          </Link>

          <div className="mt-6 flex items-center gap-3">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_STYLES[info.category]}`}
            >
              {CATEGORY_LABELS[info.category]}
            </span>
            <span className="text-xs text-gray-400">
              {formatDate(info.created_at)}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
            {info.title}
          </h1>

          <div className="mt-6 whitespace-pre-line leading-relaxed text-gray-700">
            {info.content}
          </div>
        </article>
      </main>
      <SiteFooter profile={profile} />
    </>
  );
}

import Link from "next/link";
import { getAllInfo } from "@/lib/queries";
import {
  deleteVillageInfo,
  toggleInfoPublished,
} from "@/app/dashboard/actions";
import { Alert, primaryButtonClass } from "@/components/dashboard/ui";
import {
  CATEGORY_LABELS,
  CATEGORY_STYLES,
  formatDate,
} from "@/lib/utils";

export default async function DashboardInformasiPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const [{ saved, deleted }, infoList] = await Promise.all([
    searchParams,
    getAllInfo(),
  ]);

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Informasi Desa</h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola pengumuman, berita, kegiatan, dan layanan desa.
          </p>
        </div>
        <Link href="/dashboard/informasi/baru" className={primaryButtonClass}>
          ➕ Informasi Baru
        </Link>
      </div>

      <div className="mt-6">
        <Alert saved={saved} deleted={deleted} />
      </div>

      {infoList.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-400">
          Belum ada informasi. Klik “Informasi Baru” untuk menambahkan.
        </p>
      ) : (
        <div className="space-y-4">
          {infoList.map((info) => (
            <div
              key={info.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_STYLES[info.category]}`}
                    >
                      {CATEGORY_LABELS[info.category]}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        info.published
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {info.published ? "Terpublikasi" : "Draf"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(info.created_at)}
                    </span>
                  </div>
                  <h2 className="mt-2 font-semibold text-gray-900">
                    {info.title}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {info.content}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <form action={toggleInfoPublished}>
                    <input type="hidden" name="id" value={info.id} />
                    <input
                      type="hidden"
                      name="published"
                      value={String(info.published)}
                    />
                    <button
                      type="submit"
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-emerald-200 hover:text-emerald-700"
                    >
                      {info.published ? "🙈 Sembunyikan" : "📣 Publikasikan"}
                    </button>
                  </form>
                  <Link
                    href={`/dashboard/informasi/${info.id}`}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-emerald-200 hover:text-emerald-700"
                  >
                    ✏️ Edit
                  </Link>
                  <form action={deleteVillageInfo}>
                    <input type="hidden" name="id" value={info.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      🗑️ Hapus
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

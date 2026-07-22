import Link from "next/link";
import { getPopulationStats } from "@/lib/queries";
import {
  createPopulationStat,
  deletePopulationStat,
} from "@/app/dashboard/actions";
import {
  Alert,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/components/dashboard/ui";
import { formatNumber } from "@/lib/utils";

export default async function DashboardPendudukPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  const [{ saved, deleted, error }, stats] = await Promise.all([
    searchParams,
    getPopulationStats(),
  ]);

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Data Penduduk</h1>
      <p className="mt-1 text-sm text-gray-500">
        Kelola statistik jumlah penduduk desa per tahun.
      </p>

      <div className="mt-6">
        <Alert saved={saved} deleted={deleted} error={error} />
      </div>

      {/* Form tambah */}
      <form
        action={createPopulationStat}
        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 font-semibold text-gray-900">➕ Tambah Data Tahun</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <label htmlFor="year" className={labelClass}>
              Tahun *
            </label>
            <input
              id="year"
              name="year"
              type="number"
              required
              min={1900}
              max={2200}
              placeholder="2026"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="male" className={labelClass}>
              Laki-laki
            </label>
            <input
              id="male"
              name="male"
              type="number"
              min={0}
              defaultValue={0}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="female" className={labelClass}>
              Perempuan
            </label>
            <input
              id="female"
              name="female"
              type="number"
              min={0}
              defaultValue={0}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="households" className={labelClass}>
              Kepala Keluarga
            </label>
            <input
              id="households"
              name="households"
              type="number"
              min={0}
              defaultValue={0}
              className={inputClass}
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="notes" className={labelClass}>
            Catatan
          </label>
          <input
            id="notes"
            name="notes"
            placeholder="Opsional"
            className={inputClass}
          />
        </div>
        <button type="submit" className={`mt-5 ${primaryButtonClass}`}>
          Tambah Data
        </button>
      </form>

      {/* Tabel data */}
      <div className="mt-8 overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <th className="px-5 py-3">Tahun</th>
              <th className="px-5 py-3">Laki-laki</th>
              <th className="px-5 py-3">Perempuan</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">KK</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {stats.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                  Belum ada data penduduk.
                </td>
              </tr>
            ) : (
              stats.map((stat) => (
                <tr
                  key={stat.id}
                  className="border-b border-gray-50 last:border-0"
                >
                  <td className="px-5 py-3.5 font-semibold text-gray-900">
                    {stat.year}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">
                    {formatNumber(stat.male)}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">
                    {formatNumber(stat.female)}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-emerald-700">
                    {formatNumber(stat.male + stat.female)}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">
                    {formatNumber(stat.households)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/penduduk/${stat.id}`}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-emerald-200 hover:text-emerald-700"
                      >
                        ✏️ Edit
                      </Link>
                      <form action={deletePopulationStat}>
                        <input type="hidden" name="id" value={stat.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                        >
                          🗑️ Hapus
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

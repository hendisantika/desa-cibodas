import Link from "next/link";
import {
  getAllInfo,
  getPopulationStats,
  getVillageProfile,
} from "@/lib/queries";
import { formatNumber } from "@/lib/utils";

export default async function DashboardPage() {
  const [profile, stats, infoList] = await Promise.all([
    getVillageProfile(),
    getPopulationStats(),
    getAllInfo(),
  ]);

  const latest = stats[0];
  const total = latest ? latest.male + latest.female : 0;
  const publishedCount = infoList.filter((i) => i.published).length;

  const cards = [
    {
      label: `Total Penduduk${latest ? ` (${latest.year})` : ""}`,
      value: formatNumber(total),
      icon: "👥",
      href: "/dashboard/penduduk",
    },
    {
      label: "Kepala Keluarga",
      value: formatNumber(latest?.households ?? 0),
      icon: "🏠",
      href: "/dashboard/penduduk",
    },
    {
      label: "Informasi Terpublikasi",
      value: `${publishedCount} / ${infoList.length}`,
      icon: "📢",
      href: "/dashboard/informasi",
    },
    {
      label: "Data Statistik Tahunan",
      value: `${stats.length} tahun`,
      icon: "📈",
      href: "/dashboard/penduduk",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Dashboard {profile?.name ?? "Desa"}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Ringkasan data dan pintasan pengelolaan informasi desa.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
          >
            <div className="text-2xl">{card.icon}</div>
            <p className="mt-3 text-2xl font-extrabold text-emerald-700">
              {card.value}
            </p>
            <p className="mt-1 text-sm text-gray-500">{card.label}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-bold text-gray-900">Pintasan</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Link
          href="/dashboard/profil"
          className="rounded-2xl border border-gray-100 bg-white p-5 text-sm shadow-sm transition hover:border-emerald-200"
        >
          <span className="font-semibold text-gray-900">
            🏡 Perbarui Profil Desa
          </span>
          <p className="mt-1 text-gray-500">
            Ubah deskripsi, visi misi, kontak, dan peta desa.
          </p>
        </Link>
        <Link
          href="/dashboard/penduduk"
          className="rounded-2xl border border-gray-100 bg-white p-5 text-sm shadow-sm transition hover:border-emerald-200"
        >
          <span className="font-semibold text-gray-900">
            👥 Kelola Data Penduduk
          </span>
          <p className="mt-1 text-gray-500">
            Tambah atau perbarui statistik penduduk per tahun.
          </p>
        </Link>
        <Link
          href="/dashboard/informasi/baru"
          className="rounded-2xl border border-gray-100 bg-white p-5 text-sm shadow-sm transition hover:border-emerald-200"
        >
          <span className="font-semibold text-gray-900">
            📢 Buat Informasi Baru
          </span>
          <p className="mt-1 text-gray-500">
            Publikasikan pengumuman, berita, kegiatan, atau layanan.
          </p>
        </Link>
      </div>
    </div>
  );
}

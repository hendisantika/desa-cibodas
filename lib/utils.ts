import type { InfoCategory } from "@/lib/types";

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatNumber(n: number) {
  return n.toLocaleString("id-ID");
}

export const CATEGORY_LABELS: Record<InfoCategory, string> = {
  pengumuman: "Pengumuman",
  berita: "Berita",
  kegiatan: "Kegiatan",
  layanan: "Layanan",
};

export const CATEGORY_STYLES: Record<InfoCategory, string> = {
  pengumuman: "bg-amber-100 text-amber-800",
  berita: "bg-sky-100 text-sky-800",
  kegiatan: "bg-violet-100 text-violet-800",
  layanan: "bg-emerald-100 text-emerald-800",
};

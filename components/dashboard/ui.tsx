export const inputClass =
  "w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200";

export const labelClass =
  "mb-1.5 block text-sm font-medium text-gray-700";

export const primaryButtonClass =
  "rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700";

const ERROR_MESSAGES: Record<string, string> = {
  nama: "Nama desa wajib diisi.",
  tahun: "Tahun tidak valid.",
  wajib: "Judul dan isi wajib diisi.",
  simpan: "Gagal menyimpan data. Coba lagi.",
  foto: "Pilih file foto terlebih dahulu.",
  tipe: "Format foto harus JPG, PNG, atau WebP.",
  ukuran: "Ukuran foto maksimal 5MB.",
  penuh: "Galeri sudah penuh (maksimal 5 foto). Hapus salah satu foto dulu.",
};

export function Alert({
  saved,
  deleted,
  error,
}: {
  saved?: string;
  deleted?: string;
  error?: string;
}) {
  if (saved) {
    return (
      <p className="mb-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        ✅ Data berhasil disimpan.
      </p>
    );
  }
  if (deleted) {
    return (
      <p className="mb-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
        🗑️ Data berhasil dihapus.
      </p>
    );
  }
  if (error) {
    return (
      <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
        ⚠️ {ERROR_MESSAGES[error] ?? "Terjadi kesalahan."}
      </p>
    );
  }
  return null;
}

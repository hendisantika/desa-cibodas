import Image from "next/image";
import { getGalleryPhotos, MAX_GALLERY_PHOTOS } from "@/lib/queries";
import {
  deleteGalleryPhoto,
  moveGalleryPhoto,
  updateGalleryCaption,
  uploadGalleryPhoto,
} from "@/app/dashboard/actions";
import {
  Alert,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/components/dashboard/ui";

export default async function DashboardGaleriPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  const [{ saved, deleted, error }, photos] = await Promise.all([
    searchParams,
    getGalleryPhotos(),
  ]);

  const slotsLeft = MAX_GALLERY_PHOTOS - photos.length;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Galeri Foto</h1>
      <p className="mt-1 text-sm text-gray-500">
        Kelola {MAX_GALLERY_PHOTOS} foto terbaik yang tampil di carousel
        halaman utama. Terisi {photos.length}/{MAX_GALLERY_PHOTOS}.
      </p>

      <div className="mt-6">
        <Alert saved={saved} deleted={deleted} error={error} />
      </div>

      {/* Form upload */}
      {slotsLeft > 0 ? (
        <form
          action={uploadGalleryPhoto}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 font-semibold text-gray-900">
            ➕ Unggah Foto ({slotsLeft} slot tersisa)
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="photo" className={labelClass}>
                File Foto * (JPG/PNG/WebP, maks 5MB)
              </label>
              <input
                id="photo"
                name="photo"
                type="file"
                required
                accept="image/jpeg,image/png,image/webp"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-600 shadow-sm file:mr-3 file:rounded-md file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-emerald-700"
              />
            </div>
            <div>
              <label htmlFor="caption" className={labelClass}>
                Keterangan Foto
              </label>
              <input
                id="caption"
                name="caption"
                placeholder="Contoh: Panorama sawah Desa Buninagara"
                className={inputClass}
              />
            </div>
          </div>
          <button type="submit" className={`mt-5 ${primaryButtonClass}`}>
            Unggah Foto
          </button>
        </form>
      ) : (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          Galeri penuh ({MAX_GALLERY_PHOTOS} foto). Hapus salah satu foto untuk
          mengganti dengan yang baru.
        </p>
      )}

      {/* Daftar foto */}
      {photos.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-400">
          Belum ada foto. Unggah foto pertama untuk menampilkan carousel di
          halaman utama.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              className="flex flex-wrap items-center gap-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                <Image
                  src={photo.url}
                  alt={photo.caption ?? `Foto ${i + 1}`}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
                <span className="absolute left-1.5 top-1.5 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">
                  #{i + 1}
                </span>
              </div>

              <form
                action={updateGalleryCaption}
                className="flex min-w-0 flex-1 items-center gap-2"
              >
                <input type="hidden" name="id" value={photo.id} />
                <input
                  name="caption"
                  defaultValue={photo.caption ?? ""}
                  placeholder="Keterangan foto"
                  className={inputClass}
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-emerald-200 hover:text-emerald-700"
                >
                  💾 Simpan
                </button>
              </form>

              <div className="flex shrink-0 items-center gap-2">
                <form action={moveGalleryPhoto}>
                  <input type="hidden" name="id" value={photo.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button
                    type="submit"
                    disabled={i === 0}
                    aria-label="Naikkan urutan"
                    className="rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-gray-600 transition hover:border-emerald-200 disabled:opacity-30"
                  >
                    ⬆️
                  </button>
                </form>
                <form action={moveGalleryPhoto}>
                  <input type="hidden" name="id" value={photo.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button
                    type="submit"
                    disabled={i === photos.length - 1}
                    aria-label="Turunkan urutan"
                    className="rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-gray-600 transition hover:border-emerald-200 disabled:opacity-30"
                  >
                    ⬇️
                  </button>
                </form>
                <form action={deleteGalleryPhoto}>
                  <input type="hidden" name="id" value={photo.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    🗑️ Hapus
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

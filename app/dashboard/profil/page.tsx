import { getVillageProfile } from "@/lib/queries";
import { updateVillageProfile } from "@/app/dashboard/actions";
import {
  Alert,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/components/dashboard/ui";

export default async function DashboardProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [{ saved, error }, profile] = await Promise.all([
    searchParams,
    getVillageProfile(),
  ]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Profil Desa</h1>
      <p className="mt-1 text-sm text-gray-500">
        Informasi ini ditampilkan pada halaman publik website desa.
      </p>

      <div className="mt-6">
        <Alert saved={saved} error={error} />
      </div>

      <form
        action={updateVillageProfile}
        className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>
              Nama Desa *
            </label>
            <input
              id="name"
              name="name"
              required
              defaultValue={profile?.name ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="slogan" className={labelClass}>
              Slogan
            </label>
            <input
              id="slogan"
              name="slogan"
              defaultValue={profile?.slogan ?? ""}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>
            Deskripsi
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={profile?.description ?? ""}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="history" className={labelClass}>
            Sejarah
          </label>
          <textarea
            id="history"
            name="history"
            rows={4}
            defaultValue={profile?.history ?? ""}
            className={inputClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="vision" className={labelClass}>
              Visi
            </label>
            <textarea
              id="vision"
              name="vision"
              rows={4}
              defaultValue={profile?.vision ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="mission" className={labelClass}>
              Misi
            </label>
            <textarea
              id="mission"
              name="mission"
              rows={4}
              defaultValue={profile?.mission ?? ""}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className={labelClass}>
            Alamat
          </label>
          <input
            id="address"
            name="address"
            defaultValue={profile?.address ?? ""}
            className={inputClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className={labelClass}>
              Telepon
            </label>
            <input
              id="phone"
              name="phone"
              defaultValue={profile?.phone ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={profile?.email ?? ""}
              className={inputClass}
            />
          </div>
        </div>

        <fieldset className="rounded-xl border border-gray-200 p-4">
          <legend className="px-1 text-sm font-semibold text-gray-700">
            🗺️ Peta Desa
          </legend>
          <div className="space-y-4">
            <div>
              <label htmlFor="map_embed_url" className={labelClass}>
                URL Embed Google Maps
              </label>
              <input
                id="map_embed_url"
                name="map_embed_url"
                placeholder="https://www.google.com/maps/embed?pb=..."
                defaultValue={profile?.map_embed_url ?? ""}
                className={inputClass}
              />
              <p className="mt-1.5 text-xs text-gray-400">
                Google Maps → Bagikan → Sematkan peta → salin nilai atribut
                src pada iframe.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="latitude" className={labelClass}>
                  Latitude
                </label>
                <input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  defaultValue={profile?.latitude ?? ""}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="longitude" className={labelClass}>
                  Longitude
                </label>
                <input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  defaultValue={profile?.longitude ?? ""}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </fieldset>

        <button type="submit" className={primaryButtonClass}>
          Simpan Profil
        </button>
      </form>
    </div>
  );
}

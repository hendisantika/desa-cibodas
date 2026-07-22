import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updatePopulationStat } from "@/app/dashboard/actions";
import {
  Alert,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/components/dashboard/ui";
import type { PopulationStat } from "@/lib/types";

export default async function EditPendudukPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);

  const supabase = await createClient();
  const { data: stat } = await supabase
    .from("population_stats")
    .select("*")
    .eq("id", id)
    .maybeSingle<PopulationStat>();

  if (!stat) notFound();

  return (
    <div className="max-w-2xl">
      <Link
        href="/dashboard/penduduk"
        className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
      >
        ← Kembali ke data penduduk
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        Edit Data Penduduk {stat.year}
      </h1>

      <div className="mt-6">
        <Alert error={error} />
      </div>

      <form
        action={updatePopulationStat}
        className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <input type="hidden" name="id" value={stat.id} />

        <div className="grid gap-4 sm:grid-cols-2">
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
              defaultValue={stat.year}
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
              defaultValue={stat.households}
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
              defaultValue={stat.male}
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
              defaultValue={stat.female}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className={labelClass}>
            Catatan
          </label>
          <input
            id="notes"
            name="notes"
            defaultValue={stat.notes ?? ""}
            className={inputClass}
          />
        </div>

        <button type="submit" className={primaryButtonClass}>
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}

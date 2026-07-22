import { INFO_CATEGORIES, type VillageInfo } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/utils";
import {
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/components/dashboard/ui";

export function InfoForm({
  info,
  action,
}: {
  info?: VillageInfo;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form
      action={action}
      className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      {info && <input type="hidden" name="id" value={info.id} />}

      <div>
        <label htmlFor="title" className={labelClass}>
          Judul *
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={info?.title ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="category" className={labelClass}>
          Kategori
        </label>
        <select
          id="category"
          name="category"
          defaultValue={info?.category ?? "pengumuman"}
          className={inputClass}
        >
          {INFO_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="content" className={labelClass}>
          Isi Informasi *
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={8}
          defaultValue={info?.content ?? ""}
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2.5 text-sm text-gray-700">
        <input
          type="checkbox"
          name="published"
          defaultChecked={info?.published ?? true}
          className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
        />
        Publikasikan di website
      </label>

      <button type="submit" className={primaryButtonClass}>
        {info ? "Simpan Perubahan" : "Simpan Informasi"}
      </button>
    </form>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getInfoById } from "@/lib/queries";
import { updateVillageInfo } from "@/app/dashboard/actions";
import { Alert } from "@/components/dashboard/ui";
import { InfoForm } from "@/components/dashboard/info-form";

export default async function EditInformasiPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const info = await getInfoById(id);

  if (!info) notFound();

  return (
    <div className="max-w-2xl">
      <Link
        href="/dashboard/informasi"
        className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
      >
        ← Kembali ke daftar informasi
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-gray-900">Edit Informasi</h1>

      <div className="mt-6">
        <Alert error={error} />
      </div>

      <InfoForm info={info} action={updateVillageInfo} />
    </div>
  );
}

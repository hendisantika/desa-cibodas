import Link from "next/link";
import { createVillageInfo } from "@/app/dashboard/actions";
import { Alert } from "@/components/dashboard/ui";
import { InfoForm } from "@/components/dashboard/info-form";

export default async function InformasiBaruPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-2xl">
      <Link
        href="/dashboard/informasi"
        className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
      >
        ← Kembali ke daftar informasi
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        Buat Informasi Baru
      </h1>

      <div className="mt-6">
        <Alert error={error} />
      </div>

      <InfoForm action={createVillageInfo} />
    </div>
  );
}

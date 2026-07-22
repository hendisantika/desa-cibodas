import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Masuk | Desa Cibodas",
  description: "Masuk ke dashboard administrasi Desa Cibodas",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-emerald-100/50">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">
              🏡
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Desa Cibodas</h1>
            <p className="mt-1 text-sm text-gray-500">
              Masuk untuk mengelola informasi desa
            </p>
          </div>

          <LoginForm next={next ?? "/dashboard"} />
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link
            href="/"
            className="font-medium text-emerald-700 hover:text-emerald-800"
          >
            ← Kembali ke beranda
          </Link>
        </p>
      </div>
    </main>
  );
}

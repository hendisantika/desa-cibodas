# 🏡 Desa Cibodas — Company Profile

Website company profile desa dibangun dengan **Next.js 16** (App Router, Turbopack) dan **Supabase** (Auth + Postgres + RLS).

🌐 **Live:** [desa-cibodas.vercel.app](https://desa-cibodas.vercel.app)

## ✨ Fitur

- **Halaman publik** — landing page, profil desa (sejarah, visi, misi), statistik penduduk, peta desa (Google Maps embed), dan daftar informasi (pengumuman, berita, kegiatan, layanan).
- **Login user** — autentikasi email/kata sandi via Supabase Auth, sesi dikelola lewat `proxy.ts` (pengganti middleware di Next.js 16).
- **Dashboard desa** — ringkasan data serta CRUD untuk:
  - Profil desa (deskripsi, visi misi, kontak, peta)
  - Statistik penduduk per tahun
  - Informasi desa (buat, edit, publikasikan/sembunyikan, hapus)

## 🚀 Menjalankan Proyek

### 1. Siapkan Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, jalankan seluruh isi [`supabase/schema.sql`](supabase/schema.sql) (membuat tabel, RLS policy, dan data awal).
3. Buat user admin: **Authentication → Users → Add user** (email + password, centang auto-confirm).

### 2. Konfigurasi environment

```bash
cp .env.example .env.local
```

Isi dengan kredensial dari **Project Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Jalankan

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000), lalu login di `/login` menggunakan user admin yang dibuat di langkah 1.

## 🗂️ Struktur Utama

```
app/
├── page.tsx                  # Landing page publik
├── profil/                   # Profil desa (publik)
├── informasi/                # Daftar & detail informasi (publik)
├── login/                    # Halaman login + server actions auth
└── dashboard/                # Area admin (dilindungi proxy + layout)
    ├── actions.ts            # Server actions CRUD
    ├── profil/               # Edit profil & peta desa
    ├── penduduk/             # CRUD statistik penduduk
    └── informasi/            # CRUD informasi desa
lib/
├── supabase/                 # Client browser, server, dan session proxy
├── queries.ts                # Query data server-side
└── types.ts                  # Tipe data tabel
proxy.ts                      # Next.js 16 Proxy (refresh sesi + proteksi rute)
supabase/schema.sql           # Skema database + RLS + seed
```

## 🔐 Keamanan

- Row Level Security aktif di semua tabel: publik hanya bisa membaca, penulisan hanya untuk user terautentikasi.
- Semua server action memverifikasi sesi (`supabase.auth.getUser()`) sebelum mutasi.
- Rute `/dashboard/*` dilindungi ganda: di `proxy.ts` dan di layout dashboard.

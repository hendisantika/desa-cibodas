-- =============================================================
-- Skema Database Company Profile Desa Cibodas
-- Jalankan di Supabase Dashboard → SQL Editor
-- =============================================================

-- ---------------------------------------------------------------
-- 1. Profil Desa (satu baris saja / singleton)
-- ---------------------------------------------------------------
create table if not exists public.village_profile (
  id          int primary key default 1 check (id = 1),
  name        text not null,
  slogan      text,
  description text,
  history     text,
  vision      text,
  mission     text,
  address     text,
  phone       text,
  email       text,
  -- URL embed Google Maps (iframe src) untuk peta desa
  map_embed_url text,
  latitude    double precision,
  longitude   double precision,
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- 2. Statistik Penduduk (per tahun)
-- ---------------------------------------------------------------
create table if not exists public.population_stats (
  id         uuid primary key default gen_random_uuid(),
  year       int not null unique,
  male       int not null default 0 check (male >= 0),
  female     int not null default 0 check (female >= 0),
  households int not null default 0 check (households >= 0),
  notes      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- 3. Informasi Desa (pengumuman, berita, kegiatan, layanan)
-- ---------------------------------------------------------------
create table if not exists public.village_info (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  content    text not null,
  category   text not null default 'pengumuman'
             check (category in ('pengumuman', 'berita', 'kegiatan', 'layanan')),
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Trigger updated_at otomatis
-- ---------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_village_profile_updated on public.village_profile;
create trigger trg_village_profile_updated
  before update on public.village_profile
  for each row execute function public.set_updated_at();

drop trigger if exists trg_population_stats_updated on public.population_stats;
create trigger trg_population_stats_updated
  before update on public.population_stats
  for each row execute function public.set_updated_at();

drop trigger if exists trg_village_info_updated on public.village_info;
create trigger trg_village_info_updated
  before update on public.village_info
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------
-- Row Level Security
--  - Publik boleh membaca (profil, statistik, info terpublikasi)
--  - Hanya user login (admin desa) yang boleh menulis
-- ---------------------------------------------------------------
alter table public.village_profile  enable row level security;
alter table public.population_stats enable row level security;
alter table public.village_info     enable row level security;

-- village_profile
drop policy if exists "Public read profile" on public.village_profile;
create policy "Public read profile" on public.village_profile
  for select using (true);

drop policy if exists "Authenticated write profile" on public.village_profile;
create policy "Authenticated write profile" on public.village_profile
  for all to authenticated using (true) with check (true);

-- population_stats
drop policy if exists "Public read population" on public.population_stats;
create policy "Public read population" on public.population_stats
  for select using (true);

drop policy if exists "Authenticated write population" on public.population_stats;
create policy "Authenticated write population" on public.population_stats
  for all to authenticated using (true) with check (true);

-- village_info
drop policy if exists "Public read published info" on public.village_info;
create policy "Public read published info" on public.village_info
  for select using (published or auth.role() = 'authenticated');

drop policy if exists "Authenticated write info" on public.village_info;
create policy "Authenticated write info" on public.village_info
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------
-- Data awal (seed)
-- ---------------------------------------------------------------
insert into public.village_profile
  (id, name, slogan, description, history, vision, mission, address, phone, email, map_embed_url, latitude, longitude)
values (
  1,
  'Desa Cibodas',
  'Desa Asri, Mandiri, dan Sejahtera',
  'Desa Cibodas adalah desa yang terletak di kawasan pegunungan dengan udara sejuk, panorama alam yang indah, serta masyarakat yang ramah dan menjunjung tinggi gotong royong.',
  'Desa Cibodas berdiri sejak masa kolonial dan berkembang menjadi desa agraris dengan mayoritas penduduk bermata pencaharian sebagai petani dan pelaku UMKM.',
  'Terwujudnya Desa Cibodas yang maju, mandiri, dan sejahtera berlandaskan gotong royong.',
  E'1. Meningkatkan kualitas pelayanan publik desa.\n2. Mengembangkan potensi pertanian dan UMKM lokal.\n3. Membangun infrastruktur desa yang merata.\n4. Meningkatkan kualitas pendidikan dan kesehatan masyarakat.',
  'Jl. Raya Cibodas No. 1, Kec. Lembang, Kab. Bandung Barat, Jawa Barat',
  '(022) 1234567',
  'pemdes@cibodas.desa.id',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.0!2d107.65!3d-6.83!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2zNsKwNDknNDguMCJTIDEwN8KwMzknMDAuMCJF!5e0!3m2!1sid!2sid!4v1700000000000',
  -6.83,
  107.65
)
on conflict (id) do nothing;

insert into public.population_stats (year, male, female, households) values
  (2023, 2450, 2380, 1520),
  (2024, 2510, 2445, 1568),
  (2025, 2575, 2502, 1610)
on conflict (year) do nothing;

insert into public.village_info (title, content, category) values
  ('Jadwal Posyandu Bulan Ini', 'Posyandu Melati akan dilaksanakan setiap hari Rabu minggu kedua di Balai Desa Cibodas mulai pukul 08.00 WIB.', 'pengumuman'),
  ('Kerja Bakti Membersihkan Saluran Irigasi', 'Warga RW 03 mengadakan kerja bakti membersihkan saluran irigasi guna menyambut musim tanam.', 'kegiatan'),
  ('Layanan Pembuatan Surat Keterangan', 'Pelayanan administrasi surat keterangan dibuka Senin–Jumat pukul 08.00–15.00 WIB di Kantor Desa.', 'layanan');

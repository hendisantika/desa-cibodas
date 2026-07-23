-- =============================================================
-- Skema Database Company Profile Desa Buninagara
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
  'Desa Buninagara',
  'Desa Asri, Mandiri, dan Sejahtera',
  'Desa Buninagara adalah desa di Kecamatan Kutawaringin, Kabupaten Bandung, Provinsi Jawa Barat, dengan masyarakat yang ramah dan menjunjung tinggi gotong royong.',
  'Desa Buninagara merupakan salah satu desa di Kecamatan Kutawaringin, Kabupaten Bandung, yang berkembang menjadi desa agraris dengan mayoritas penduduk bermata pencaharian sebagai petani dan pelaku UMKM.',
  'Terwujudnya Desa Buninagara yang maju, mandiri, dan sejahtera berlandaskan gotong royong.',
  E'1. Meningkatkan kualitas pelayanan publik desa.\n2. Mengembangkan potensi pertanian dan UMKM lokal.\n3. Membangun infrastruktur desa yang merata.\n4. Meningkatkan kualitas pendidikan dan kesehatan masyarakat.',
  'Desa Buninagara, Kec. Kutawaringin, Kab. Bandung, Provinsi Jawa Barat',
  '(022) 1234567',
  'pemdes@buninagara.desa.id',
  'https://maps.google.com/maps?q=Desa%20Buninagara%2C%20Kutawaringin%2C%20Kabupaten%20Bandung&z=14&output=embed',
  -7.01,
  107.47
)
on conflict (id) do nothing;

insert into public.population_stats (year, male, female, households) values
  (2023, 2450, 2380, 1520),
  (2024, 2510, 2445, 1568),
  (2025, 2575, 2502, 1610)
on conflict (year) do nothing;

insert into public.village_info (title, content, category) values
  ('Jadwal Posyandu Bulan Ini', 'Posyandu Melati akan dilaksanakan setiap hari Rabu minggu kedua di Balai Desa Buninagara mulai pukul 08.00 WIB.', 'pengumuman'),
  ('Kerja Bakti Membersihkan Saluran Irigasi', 'Warga RW 03 mengadakan kerja bakti membersihkan saluran irigasi guna menyambut musim tanam.', 'kegiatan'),
  ('Layanan Pembuatan Surat Keterangan', 'Pelayanan administrasi surat keterangan dibuka Senin–Jumat pukul 08.00–15.00 WIB di Kantor Desa.', 'layanan');

-- ---------------------------------------------------------------
-- 4. Galeri Foto (maksimal 5 foto terbaik untuk carousel)
-- ---------------------------------------------------------------
create table if not exists public.gallery_photos (
  id           uuid primary key default gen_random_uuid(),
  caption      text,
  storage_path text not null,
  sort_order   int not null default 1,
  created_at   timestamptz not null default now()
);

alter table public.gallery_photos enable row level security;

drop policy if exists "Public read gallery" on public.gallery_photos;
create policy "Public read gallery" on public.gallery_photos
  for select using (true);

drop policy if exists "Authenticated write gallery" on public.gallery_photos;
create policy "Authenticated write gallery" on public.gallery_photos
  for all to authenticated using (true) with check (true);

-- Bucket penyimpanan foto (public read)
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

drop policy if exists "Public read gallery objects" on storage.objects;
create policy "Public read gallery objects" on storage.objects
  for select using (bucket_id = 'gallery');

drop policy if exists "Authenticated write gallery objects" on storage.objects;
create policy "Authenticated write gallery objects" on storage.objects
  for all to authenticated
  using (bucket_id = 'gallery') with check (bucket_id = 'gallery');

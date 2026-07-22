export type VillageProfile = {
  id: number;
  name: string;
  slogan: string | null;
  description: string | null;
  history: string | null;
  vision: string | null;
  mission: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  map_embed_url: string | null;
  latitude: number | null;
  longitude: number | null;
  updated_at: string;
};

export type PopulationStat = {
  id: string;
  year: number;
  male: number;
  female: number;
  households: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const INFO_CATEGORIES = [
  "pengumuman",
  "berita",
  "kegiatan",
  "layanan",
] as const;

export type InfoCategory = (typeof INFO_CATEGORIES)[number];

export type VillageInfo = {
  id: string;
  title: string;
  content: string;
  category: InfoCategory;
  published: boolean;
  created_at: string;
  updated_at: string;
};

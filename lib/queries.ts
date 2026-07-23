import { createClient } from "@/lib/supabase/server";
import type {
  GalleryPhoto,
  PopulationStat,
  VillageInfo,
  VillageProfile,
} from "@/lib/types";

export async function getVillageProfile(): Promise<VillageProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("village_profile")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("getVillageProfile:", error.message);
    return null;
  }
  return data;
}

export async function getPopulationStats(): Promise<PopulationStat[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("population_stats")
    .select("*")
    .order("year", { ascending: false });

  if (error) {
    console.error("getPopulationStats:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getPublishedInfo(limit?: number): Promise<VillageInfo[]> {
  const supabase = await createClient();
  let query = supabase
    .from("village_info")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;

  if (error) {
    console.error("getPublishedInfo:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getInfoById(id: string): Promise<VillageInfo | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("village_info")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getInfoById:", error.message);
    return null;
  }
  return data;
}

export const MAX_GALLERY_PHOTOS = 5;

export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_photos")
    .select("*")
    .order("sort_order", { ascending: true })
    .limit(MAX_GALLERY_PHOTOS);

  if (error) {
    console.error("getGalleryPhotos:", error.message);
    return [];
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return (data ?? []).map((photo) => ({
    ...photo,
    url: `${base}/storage/v1/object/public/gallery/${photo.storage_path}`,
  }));
}

export async function getAllInfo(): Promise<VillageInfo[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("village_info")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllInfo:", error.message);
    return [];
  }
  return data ?? [];
}

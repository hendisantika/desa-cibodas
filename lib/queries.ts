import { createClient } from "@/lib/supabase/server";
import type { PopulationStat, VillageInfo, VillageProfile } from "@/lib/types";

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

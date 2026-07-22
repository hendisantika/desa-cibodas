"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { INFO_CATEGORIES, type InfoCategory } from "@/lib/types";

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
  return supabase;
}

function toInt(value: FormDataEntryValue | null, fallback = 0): number {
  const n = parseInt(String(value ?? ""), 10);
  return Number.isNaN(n) ? fallback : n;
}

function toFloatOrNull(value: FormDataEntryValue | null): number | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const n = parseFloat(raw);
  return Number.isNaN(n) ? null : n;
}

function toText(value: FormDataEntryValue | null): string | null {
  const raw = String(value ?? "").trim();
  return raw === "" ? null : raw;
}

// ---------------------------------------------------------------
// Profil Desa
// ---------------------------------------------------------------
export async function updateVillageProfile(formData: FormData) {
  const supabase = await requireAuth();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) redirect("/dashboard/profil?error=nama");

  const { error } = await supabase.from("village_profile").upsert({
    id: 1,
    name,
    slogan: toText(formData.get("slogan")),
    description: toText(formData.get("description")),
    history: toText(formData.get("history")),
    vision: toText(formData.get("vision")),
    mission: toText(formData.get("mission")),
    address: toText(formData.get("address")),
    phone: toText(formData.get("phone")),
    email: toText(formData.get("email")),
    map_embed_url: toText(formData.get("map_embed_url")),
    latitude: toFloatOrNull(formData.get("latitude")),
    longitude: toFloatOrNull(formData.get("longitude")),
  });

  if (error) redirect("/dashboard/profil?error=simpan");

  revalidatePath("/", "layout");
  redirect("/dashboard/profil?saved=1");
}

// ---------------------------------------------------------------
// Statistik Penduduk
// ---------------------------------------------------------------
export async function createPopulationStat(formData: FormData) {
  const supabase = await requireAuth();

  const year = toInt(formData.get("year"));
  if (year < 1900 || year > 2200) redirect("/dashboard/penduduk?error=tahun");

  const { error } = await supabase.from("population_stats").insert({
    year,
    male: toInt(formData.get("male")),
    female: toInt(formData.get("female")),
    households: toInt(formData.get("households")),
    notes: toText(formData.get("notes")),
  });

  if (error) redirect("/dashboard/penduduk?error=simpan");

  revalidatePath("/", "layout");
  redirect("/dashboard/penduduk?saved=1");
}

export async function updatePopulationStat(formData: FormData) {
  const supabase = await requireAuth();

  const id = String(formData.get("id") ?? "");
  const year = toInt(formData.get("year"));
  if (!id) redirect("/dashboard/penduduk");
  if (year < 1900 || year > 2200) {
    redirect(`/dashboard/penduduk/${id}?error=tahun`);
  }

  const { error } = await supabase
    .from("population_stats")
    .update({
      year,
      male: toInt(formData.get("male")),
      female: toInt(formData.get("female")),
      households: toInt(formData.get("households")),
      notes: toText(formData.get("notes")),
    })
    .eq("id", id);

  if (error) redirect(`/dashboard/penduduk/${id}?error=simpan`);

  revalidatePath("/", "layout");
  redirect("/dashboard/penduduk?saved=1");
}

export async function deletePopulationStat(formData: FormData) {
  const supabase = await requireAuth();

  const id = String(formData.get("id") ?? "");
  if (id) {
    await supabase.from("population_stats").delete().eq("id", id);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard/penduduk?deleted=1");
}

// ---------------------------------------------------------------
// Informasi Desa
// ---------------------------------------------------------------
function parseCategory(value: FormDataEntryValue | null): InfoCategory {
  const raw = String(value ?? "");
  return (INFO_CATEGORIES as readonly string[]).includes(raw)
    ? (raw as InfoCategory)
    : "pengumuman";
}

export async function createVillageInfo(formData: FormData) {
  const supabase = await requireAuth();

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  if (!title || !content) redirect("/dashboard/informasi/baru?error=wajib");

  const { error } = await supabase.from("village_info").insert({
    title,
    content,
    category: parseCategory(formData.get("category")),
    published: formData.get("published") === "on",
  });

  if (error) redirect("/dashboard/informasi/baru?error=simpan");

  revalidatePath("/", "layout");
  redirect("/dashboard/informasi?saved=1");
}

export async function updateVillageInfo(formData: FormData) {
  const supabase = await requireAuth();

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  if (!id) redirect("/dashboard/informasi");
  if (!title || !content) {
    redirect(`/dashboard/informasi/${id}?error=wajib`);
  }

  const { error } = await supabase
    .from("village_info")
    .update({
      title,
      content,
      category: parseCategory(formData.get("category")),
      published: formData.get("published") === "on",
    })
    .eq("id", id);

  if (error) redirect(`/dashboard/informasi/${id}?error=simpan`);

  revalidatePath("/", "layout");
  redirect("/dashboard/informasi?saved=1");
}

export async function toggleInfoPublished(formData: FormData) {
  const supabase = await requireAuth();

  const id = String(formData.get("id") ?? "");
  const published = formData.get("published") === "true";
  if (id) {
    await supabase
      .from("village_info")
      .update({ published: !published })
      .eq("id", id);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard/informasi");
}

export async function deleteVillageInfo(formData: FormData) {
  const supabase = await requireAuth();

  const id = String(formData.get("id") ?? "");
  if (id) {
    await supabase.from("village_info").delete().eq("id", id);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard/informasi?deleted=1");
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MAX_GALLERY_PHOTOS } from "@/lib/queries";
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

// ---------------------------------------------------------------
// Galeri Foto (maks 5 foto untuk carousel)
// ---------------------------------------------------------------
const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_PHOTO_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function uploadGalleryPhoto(formData: FormData) {
  const supabase = await requireAuth();

  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) {
    redirect("/dashboard/galeri?error=foto");
  }

  const ext = ALLOWED_PHOTO_TYPES[file.type];
  if (!ext) redirect("/dashboard/galeri?error=tipe");
  if (file.size > MAX_PHOTO_BYTES) redirect("/dashboard/galeri?error=ukuran");

  const { count } = await supabase
    .from("gallery_photos")
    .select("*", { count: "exact", head: true });
  if ((count ?? 0) >= MAX_GALLERY_PHOTOS) {
    redirect("/dashboard/galeri?error=penuh");
  }

  const storagePath = `photos/${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("gallery")
    .upload(storagePath, file, { contentType: file.type });
  if (uploadError) {
    console.error("uploadGalleryPhoto storage:", uploadError.message);
    redirect("/dashboard/galeri?error=simpan");
  }

  const { error: insertError } = await supabase.from("gallery_photos").insert({
    caption: toText(formData.get("caption")),
    storage_path: storagePath,
    sort_order: (count ?? 0) + 1,
  });
  if (insertError) {
    await supabase.storage.from("gallery").remove([storagePath]);
    redirect("/dashboard/galeri?error=simpan");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard/galeri?saved=1");
}

export async function updateGalleryCaption(formData: FormData) {
  const supabase = await requireAuth();

  const id = String(formData.get("id") ?? "");
  if (id) {
    await supabase
      .from("gallery_photos")
      .update({ caption: toText(formData.get("caption")) })
      .eq("id", id);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard/galeri?saved=1");
}

export async function moveGalleryPhoto(formData: FormData) {
  const supabase = await requireAuth();

  const id = String(formData.get("id") ?? "");
  const direction = String(formData.get("direction") ?? "");
  if (!id || (direction !== "up" && direction !== "down")) {
    redirect("/dashboard/galeri");
  }

  const { data: photos } = await supabase
    .from("gallery_photos")
    .select("id, sort_order")
    .order("sort_order", { ascending: true });

  const list = photos ?? [];
  const idx = list.findIndex((p) => p.id === id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;

  if (idx !== -1 && swapIdx >= 0 && swapIdx < list.length) {
    const a = list[idx];
    const b = list[swapIdx];
    await supabase
      .from("gallery_photos")
      .update({ sort_order: b.sort_order })
      .eq("id", a.id);
    await supabase
      .from("gallery_photos")
      .update({ sort_order: a.sort_order })
      .eq("id", b.id);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard/galeri");
}

export async function deleteGalleryPhoto(formData: FormData) {
  const supabase = await requireAuth();

  const id = String(formData.get("id") ?? "");
  if (id) {
    const { data: photo } = await supabase
      .from("gallery_photos")
      .select("storage_path")
      .eq("id", id)
      .maybeSingle();

    await supabase.from("gallery_photos").delete().eq("id", id);
    if (photo?.storage_path) {
      await supabase.storage.from("gallery").remove([photo.storage_path]);
    }
  }

  revalidatePath("/", "layout");
  redirect("/dashboard/galeri?deleted=1");
}

import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const SUPABASE_URL = "https://vczjikexwngpjuqlmase.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_WI3XbrS2joJn-bJlp_59Pw_lfuKNqmm";

const STORAGE_KEY_RESPONSES = "tau_tracer_responses_real_v3";
const STORAGE_KEY_DRAFT = "tau_tracer_draft_real_v3";
const STORAGE_KEY_TARGET = "tau_tracer_target_graduates_v1";

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to convert snake_case DB columns to camelCase JS object
const mapFromDb = (row) => {
  if (!row) return null;
  return {
    ...row,
    tahunLulus: row.tahun_lulus || row.tahunLulus,
    submittedAt: row.submitted_at || row.submittedAt
  };
};

export const getStoredResponses = async () => {
  // Helper: get from localStorage cache
  const getLocalCache = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_RESPONSES);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  };

  try {
    // Race: Supabase vs 5-second timeout so UI never hangs
    const supabasePromise = supabase
      .from("tracer_responses")
      .select("*")
      .order("submitted_at", { ascending: false });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Supabase timeout")), 5000)
    );

    const { data, error } = await Promise.race([supabasePromise, timeoutPromise]);

    if (!error && data) {
      const mapped = data.map(mapFromDb);
      // Always overwrite local cache with the authoritative cloud data
      localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(mapped));
      return mapped;
    }
    // Supabase returned an error — fall through to local cache
    console.warn("Supabase returned error:", error?.message);
  } catch (e) {
    console.warn("Supabase fetch failed, using local cache:", e.message);
  }

  // Fallback to localStorage cache (offline / slow connection)
  return getLocalCache();
};

export const saveResponse = async (newData) => {
  const entryId = newData.id || `TAU-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
  const submittedAt = newData.submittedAt || new Date().toISOString();

  const formattedData = {
    id: entryId,
    kdptim: newData.kdptim || "031054",
    kdpst: newData.kdpst || "",
    nim: newData.nim || "",
    nama: newData.nama || "",
    hp: newData.hp || "",
    email: newData.email || "",
    nik: newData.nik || "",
    npwp: newData.npwp || "",
    tahun_lulus: newData.tahun_lulus || newData.tahunLulus || "2026",
    f8: String(newData.f8 || ""),
    f502: String(newData.f502 || ""),
    f505: String(newData.f505 || ""),
    f5a1: String(newData.f5a1 || ""),
    f5a2: String(newData.f5a2 || ""),
    f1101: String(newData.f1101 || ""),
    f1102: String(newData.f1102 || ""),
    f5b: String(newData.f5b || ""),
    f5c: String(newData.f5c || ""),
    f5d: String(newData.f5d || ""),
    f18a: String(newData.f18a || ""),
    f18b: String(newData.f18b || ""),
    f18c: String(newData.f18c || ""),
    f18d: String(newData.f18d || ""),
    f1001: String(newData.f1001 || ""),
    f1002: String(newData.f1002 || ""),
    f1301a: String(newData.f1301a || "4"),
    f1301b: String(newData.f1301b || "5"),
    f1302a: String(newData.f1302a || "4"),
    f1302b: String(newData.f1302b || "5"),
    f1303a: String(newData.f1303a || "4"),
    f1303b: String(newData.f1303b || "4"),
    f1304a: String(newData.f1304a || "4"),
    f1304b: String(newData.f1304b || "5"),
    f1305a: String(newData.f1305a || "4"),
    f1305b: String(newData.f1305b || "5"),
    f1306a: String(newData.f1306a || "4"),
    f1306b: String(newData.f1306b || "5"),
    f1307a: String(newData.f1307a || "4"),
    f1307b: String(newData.f1307b || "5"),
    f1401: String(newData.f1401 || "4"),
    f1402: String(newData.f1402 || "4"),
    f1403: String(newData.f1403 || "5"),
    f1404: String(newData.f1404 || "4"),
    f1405: String(newData.f1405 || "5"),
    f11: String(newData.f11 || ""),
    f12: String(newData.f12 || ""),
    f1601: String(newData.f1601 || "0"),
    f1602: String(newData.f1602 || "0"),
    f1603: String(newData.f1603 || "0"),
    f1604: String(newData.f1604 || "0"),
    f1605: String(newData.f1605 || "0"),
    f1606: String(newData.f1606 || "0"),
    f1607: String(newData.f1607 || "0"),
    f1608: String(newData.f1608 || "0"),
    f1613: String(newData.f1613 || ""),
    f1614: String(newData.f1614 || ""),
    submitted_at: submittedAt
  };

  // Save to local storage immediately
  const localEntry = { ...newData, id: entryId, submittedAt };
  const current = JSON.parse(localStorage.getItem(STORAGE_KEY_RESPONSES) || "[]");
  localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify([localEntry, ...current]));
  clearDraft();

  // Save to Supabase Cloud directly
  try {
    await supabase.from("tracer_responses").insert([formattedData]);
  } catch (e) {
    console.error("Error inserting to Supabase:", e);
  }

  return localEntry;
};

export const updateResponse = async (id, updatedData) => {
  // Optimistic local update first for instant UI feedback
  const current = JSON.parse(localStorage.getItem(STORAGE_KEY_RESPONSES) || "[]");
  const index = current.findIndex((item) => (item.id || item.nim) === id);
  if (index !== -1) {
    current[index] = { ...current[index], ...updatedData, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(current));
  }

  try {
    await supabase.from("tracer_responses").update(updatedData).eq("id", id);
  } catch (e) {
    console.error("Error updating Supabase:", e);
  }

  // Re-fetch from Supabase to get the authoritative list
  return await getStoredResponses();
};

export const deleteResponse = async (id) => {
  // Optimistic local delete first for instant UI feedback
  const current = JSON.parse(localStorage.getItem(STORAGE_KEY_RESPONSES) || "[]");
  const updated = current.filter((item) => (item.id || item.nim) !== id);
  localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(updated));

  try {
    await supabase.from("tracer_responses").delete().eq("id", id);
  } catch (e) {
    console.error("Error deleting from Supabase:", e);
  }

  // Re-fetch from Supabase to get the authoritative list
  return await getStoredResponses();
};

export const getTargetGraduates = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TARGET);
    return raw ? parseInt(raw, 10) : 100;
  } catch (e) {
    return 100;
  }
};

export const setTargetGraduates = (count) => {
  try {
    const num = Math.max(1, parseInt(count, 10) || 1);
    localStorage.setItem(STORAGE_KEY_TARGET, String(num));
    return num;
  } catch (e) {
    return 100;
  }
};

export const resetToDefaultData = () => {
  localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify([]));
  return [];
};

export const saveDraft = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving draft:", e);
  }
};

export const getDraft = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DRAFT);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const clearDraft = () => {
  localStorage.removeItem(STORAGE_KEY_DRAFT);
};

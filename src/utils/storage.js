import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────
//  Supabase Cloud Database Client — SINGLE SOURCE OF TRUTH
// ─────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://vczjikexwngpjuqlmase.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_WI3XbrS2joJn-bJlp_59Pw_lfuKNqmm";

const STORAGE_KEY_RESPONSES = "tau_tracer_responses_real_v3";
const STORAGE_KEY_DRAFT = "tau_tracer_draft_v4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper: Map database columns (snake_case) to JS object properties
const mapFromDb = (row) => {
  if (!row) return null;
  return {
    ...row,
    tahunLulus: row.tahun_lulus || row.tahunLulus,
    submittedAt: row.submitted_at || row.submittedAt,
  };
};

// Format JS object into DB schema (snake_case)
const formatForDb = (newData) => {
  const entryId =
    newData.id ||
    `TAU-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
  const submittedAt = newData.submittedAt || new Date().toISOString();

  return {
    id: entryId,
    kdptim: newData.kdptim || "031054",
    kdpst: newData.kdpst || "",
    nim: newData.nim || "",
    nama: newData.nama || "",
    hp: newData.hp || "",
    email: newData.email || "",
    nik: newData.nik || "",
    npwp: newData.npwp || "",
    tahun_lulus: String(newData.tahun_lulus || newData.tahunLulus || "2026"),
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
    submitted_at: submittedAt,
  };
};

// ─── READ ─────────────────────────────────────────────────────
export const getStoredResponses = async () => {
  try {
    const { data, error } = await supabase
      .from("tracer_responses")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("Supabase query error:", error.message);
      return [];
    }

    const dbResponses = (data || []).map(mapFromDb);

    // Sync to local cache (without re-inserting deleted items)
    try {
      localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(dbResponses));
    } catch (e) {}

    return dbResponses;
  } catch (err) {
    console.error("Supabase connection exception:", err);
    // Fallback to local cache if offline
    try {
      const raw = localStorage.getItem(STORAGE_KEY_RESPONSES);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
};

// ─── CREATE ───────────────────────────────────────────────────
export const saveResponse = async (newData) => {
  const formattedPayload = formatForDb(newData);
  const mappedEntry = mapFromDb(formattedPayload);

  clearDraft();

  try {
    const { error } = await supabase
      .from("tracer_responses")
      .insert([formattedPayload]);
    if (error) console.error("Error saving to Supabase:", error.message);
  } catch (e) {
    console.error("Supabase insert exception:", e);
  }

  // Return authoritative data from Supabase
  return await getStoredResponses();
};

// ─── UPDATE ───────────────────────────────────────────────────
export const updateResponse = async (id, updatedData) => {
  try {
    const { error } = await supabase
      .from("tracer_responses")
      .update(updatedData)
      .eq("id", id);
    if (error) console.error("Error updating Supabase:", error.message);
  } catch (e) {
    console.error("Supabase update exception:", e);
  }

  return await getStoredResponses();
};

// ─── DELETE ───────────────────────────────────────────────────
export const deleteResponse = async (id) => {
  // Clear local storage cache to prevent zombie data
  try {
    localStorage.removeItem(STORAGE_KEY_RESPONSES);
  } catch (e) {}

  try {
    const { error } = await supabase
      .from("tracer_responses")
      .delete()
      .eq("id", id);
    if (error) console.error("Error deleting from Supabase:", error.message);
  } catch (e) {
    console.error("Supabase delete exception:", e);
  }

  return await getStoredResponses();
};

// ─── TARGET LULUSAN ───────────────────────────────────────────
export const getTargetGraduates = () => {
  try {
    const raw = sessionStorage.getItem("tau_target_graduates");
    return raw ? parseInt(raw, 10) : 100;
  } catch (e) {
    return 100;
  }
};

export const setTargetGraduates = (count) => {
  try {
    const num = Math.max(1, parseInt(count, 10) || 1);
    sessionStorage.setItem("tau_target_graduates", String(num));
    return num;
  } catch (e) {
    return 100;
  }
};

export const resetToDefaultData = async () => {
  try {
    localStorage.removeItem(STORAGE_KEY_RESPONSES);
    await supabase.from("tracer_responses").delete().neq("id", "none");
  } catch (e) {}
  return [];
};

// ─── DRAFT ────────────────────────────────────────────────────
export const saveDraft = (data) => {
  try {
    sessionStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(data));
  } catch (e) {}
};

export const getDraft = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_DRAFT);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {}
  return null;
};

export const clearDraft = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY_DRAFT);
  } catch (e) {}
};



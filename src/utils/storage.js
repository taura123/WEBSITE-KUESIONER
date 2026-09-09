const STORAGE_KEY_RESPONSES = "tau_tracer_responses_real_v3";
const STORAGE_KEY_DRAFT = "tau_tracer_draft_real_v3";
const STORAGE_KEY_TARGET = "tau_tracer_target_graduates_v1";
const API_URL = "http://localhost:5000/api";

export const getStoredResponses = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RESPONSES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify([]));
      return [];
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading localStorage responses:", e);
    return [];
  }
};

export const saveResponse = (newData) => {
  const current = getStoredResponses();
  const entry = {
    ...newData,
    id: newData.id || `TAU-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
    submittedAt: newData.submittedAt || new Date().toISOString()
  };

  const updated = [entry, ...current];
  localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(updated));
  clearDraft();

  // Sync to backend if running
  fetch(`${API_URL}/responses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry)
  }).catch(() => {});

  return entry;
};

// Update existing respondent data (Edit / Update in CRUD)
export const updateResponse = (id, updatedData) => {
  const current = getStoredResponses();
  const index = current.findIndex((item) => (item.id || item.nim) === id);
  if (index !== -1) {
    current[index] = { ...current[index], ...updatedData, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(current));

    fetch(`${API_URL}/responses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(current[index])
    }).catch(() => {});
  }
  return current;
};

// Delete respondent (Delete in CRUD)
export const deleteResponse = (id) => {
  const current = getStoredResponses();
  const updated = current.filter((item) => (item.id || item.nim) !== id);
  localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(updated));

  fetch(`${API_URL}/responses/${id}`, {
    method: "DELETE"
  }).catch(() => {});

  return updated;
};

// Target Graduates Setting (Editable by Admin)
export const getTargetGraduates = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TARGET);
    return raw ? parseInt(raw, 10) : 100; // Default 100
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

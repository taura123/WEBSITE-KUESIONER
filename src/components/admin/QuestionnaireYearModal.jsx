import React, { useState, useEffect } from "react";
import { Calendar, Plus, Check, X, ShieldAlert } from "lucide-react";
import { getQuestionnaireYearConfig, setQuestionnaireYearConfig } from "../../utils/storage";

export default function QuestionnaireYearModal({ isOpen, onClose, onYearConfigUpdated }) {
  const [activeYear, setActiveYear] = useState("2026");
  const [availableYears, setAvailableYears] = useState(["2023", "2024", "2025", "2026", "2027", "2028"]);
  const [newYearInput, setNewYearInput] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = getQuestionnaireYearConfig();
      setActiveYear(cfg.activeYear);
      setAvailableYears(cfg.availableYears);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddYear = (e) => {
    e.preventDefault();
    const cleanYear = newYearInput.trim();
    if (cleanYear && /^\d{4}$/.test(cleanYear)) {
      if (!availableYears.includes(cleanYear)) {
        const updated = [...availableYears, cleanYear].sort((a, b) => b - a);
        setAvailableYears(updated);
        setActiveYear(cleanYear);
      }
      setNewYearInput("");
    }
  };

  const handleSave = () => {
    const newConfig = setQuestionnaireYearConfig({
      activeYear,
      availableYears
    });
    setSavedSuccess(true);
    if (onYearConfigUpdated) onYearConfigUpdated(newConfig);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">

        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-[#094E96] text-white border-b border-blue-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Pengaturan Tahun Kuesioner</h3>
              <p className="text-xs text-blue-200 mt-0.5">
                Atur tahun survei tracer study aktif yang diisi oleh alumni
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 text-xs text-slate-800">

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-amber-900">
            <ShieldAlert className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
            <div className="space-y-0.5">
              <span className="font-bold text-xs text-amber-950">Dampak Perubahan Tahun Kuesioner:</span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Tahun yang dipilih sebagai <strong>Tahun Aktif</strong> akan secara otomatis menjadi default tahun lulus di Form Kuesioner Alumni (misal: 2027) dan memperbarui opsi dropdown wisuda.
              </p>
            </div>
          </div>

          {/* Active Year Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Tahun Kuesioner Aktif Saat Ini:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {availableYears.map((yr) => {
                const isActive = activeYear === yr;
                return (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setActiveYear(yr)}
                    className={`py-3 px-3 rounded-xl border text-center font-bold text-sm transition-all flex flex-col items-center justify-center gap-1 ${
                      isActive
                        ? "bg-[#094E96] text-white border-[#094E96] shadow-sm ring-2 ring-blue-300"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>Tahun {yr}</span>
                    {isActive && <span className="text-[10px] font-medium bg-white/20 px-2 py-0.5 rounded-full">Aktif</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add New Year */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Tambah Pilihan Tahun Kuesioner Baru (Misal: 2027, 2028):
            </label>
            <form onSubmit={handleAddYear} className="flex gap-2">
              <input
                type="text"
                maxLength={4}
                placeholder="Contoh: 2027"
                value={newYearInput}
                onChange={(e) => setNewYearInput(e.target.value.replace(/\D/g, ""))}
                className="form-input font-mono text-xs flex-1"
              />
              <button
                type="submit"
                disabled={!newYearInput || newYearInput.length !== 4}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg font-bold text-xs hover:bg-slate-900 disabled:opacity-50 flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah</span>
              </button>
            </form>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600 shrink-0" />
              <span>Pengaturan tahun kuesioner berhasil diperbarui!</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button onClick={onClose} className="btn-ghost text-xs py-2 px-4">
            Batal
          </button>
          <button
            onClick={handleSave}
            className="btn-primary text-xs py-2.5 px-6 bg-[#094E96] hover:bg-[#0A3B75] flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { X, Save, Target, Check } from "lucide-react";

export default function TargetGraduatesModal({ isOpen, onClose, currentTarget, onSave }) {
  const [targetVal, setTargetVal] = useState(currentTarget || 100);

  useEffect(() => {
    setTargetVal(currentTarget || 100);
  }, [currentTarget, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Math.max(1, parseInt(targetVal, 10) || 1);
    onSave(num);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-[#0F2042] text-white">
          <div className="flex items-center gap-2.5">
            <Target className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-sm">Ubah Target Jumlah Lulusan</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Jumlah Target Lulusan (Populasi Cohort Tracer Study)
            </label>
            <input
              type="number"
              min="1"
              max="50000"
              required
              value={targetVal}
              onChange={(e) => setTargetVal(e.target.value)}
              className="form-input text-base font-bold font-mono text-[#0F2042]"
            />
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              Angka ini digunakan sebagai penyebut untuk menghitung <strong>Response Rate</strong> kuesioner tracer study (Total Responden / Target Lulusan).
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost text-xs py-2 px-3.5"
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-primary text-xs py-2 px-4 bg-[#0F2042] hover:bg-[#1B3A7A]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Target</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { X, Save, UserPlus, Edit3, AlertCircle } from "lucide-react";
import { TAU_PRODI_LIST, KODE_PT_TAU } from "../../data/tauProdi";

const INITIAL_STATE = {
  kdptim: KODE_PT_TAU,
  kdpst: "",
  nim: "",
  nama: "",
  hp: "",
  email: "",
  nik: "",
  npwp: "",
  tahun_lulus: String(new Date().getFullYear()),
  f8: "1",
  f502: "",
  f505: "",
  f5a1: "31",
  f5a2: "",
  f1101: "3",
  f1102: "",
  f5b: "",
  f5c: "",
  f5d: "2",
  f18a: "",
  f18b: "",
  f18c: "",
  f18d: "",
  f11: "1",
  f12: "2",
  f1001: "",
  f1002: "",
  f1301a: "4", f1301b: "5",
  f1302a: "4", f1302b: "5",
  f1303a: "4", f1303b: "4",
  f1304a: "4", f1304b: "5",
  f1305a: "4", f1305b: "5",
  f1306a: "4", f1306b: "5",
  f1307a: "4", f1307b: "5",
  f1401: "4", f1402: "4", f1403: "5", f1404: "4", f1405: "5",
  f1601: "0", f1602: "0", f1603: "0", f1604: "1", f1605: "0", f1606: "0", f1607: "0", f1608: "0",
  f1613: "", f1614: ""
};

export default function RespondentFormModal({ isOpen, onClose, onSave, editData }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [error, setError] = useState("");

  const isEdit = !!editData;

  useEffect(() => {
    if (editData) {
      setFormData({ ...INITIAL_STATE, ...editData });
    } else {
      setFormData(INITIAL_STATE);
    }
    setError("");
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handle = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nim || !formData.nama || !formData.kdpst) {
      setError("NIM, Nama Lengkap, dan Program Studi wajib diisi.");
      return;
    }
    onSave(formData);
    onClose();
  };

  const currentYear = new Date().getFullYear();
  const gradYears = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4, currentYear - 5];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden my-8 max-h-[90vh] flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-[#0F2042] text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              {isEdit ? <Edit3 className="w-5 h-5 text-sky-300" /> : <UserPlus className="w-5 h-5 text-sky-300" />}
            </div>
            <div>
              <h3 className="text-base font-bold">
                {isEdit ? "Edit Data Responden Alumni" : "Tambah Data Responden Baru"}
              </h3>
              <p className="text-xs text-slate-300">
                {isEdit ? `Mengubah data NIM: ${formData.nim}` : "Input manual oleh Biro Alumni TAU"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NIM */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIM *</label>
              <input
                type="text"
                required
                value={formData.nim}
                onChange={(e) => handle("nim", e.target.value)}
                placeholder="Contoh: 112020088"
                className="form-input text-xs font-mono"
              />
            </div>

            {/* Nama */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
              <input
                type="text"
                required
                value={formData.nama}
                onChange={(e) => handle("nama", e.target.value)}
                placeholder="Nama sesuai ijazah"
                className="form-input text-xs"
              />
            </div>

            {/* Tahun Lulus */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tahun Lulus *</label>
              <select
                required
                value={formData.tahun_lulus}
                onChange={(e) => handle("tahun_lulus", e.target.value)}
                className="form-input text-xs"
              >
                <option value="2026">2026</option>
              </select>
            </div>

            {/* Program Studi */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Program Studi *</label>
              <select
                required
                value={formData.kdpst}
                onChange={(e) => handle("kdpst", e.target.value)}
                className="form-input text-xs"
              >
                <option value="">-- Pilih Prodi --</option>
                {TAU_PRODI_LIST.map((p) => (
                  <option key={p.kode} value={p.kode}>{p.nama}</option>
                ))}
              </select>
            </div>

            {/* NIK */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIK (16 Digit)</label>
              <input
                type="text"
                maxLength={16}
                value={formData.nik}
                onChange={(e) => handle("nik", e.target.value)}
                placeholder="16 digit KTP"
                className="form-input text-xs font-mono"
              />
            </div>

            {/* NPWP */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">NPWP</label>
              <input
                type="text"
                value={formData.npwp}
                onChange={(e) => handle("npwp", e.target.value)}
                placeholder="Nomor NPWP"
                className="form-input text-xs font-mono"
              />
            </div>

            {/* HP */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">No WhatsApp / HP</label>
              <input
                type="text"
                value={formData.hp}
                onChange={(e) => handle("hp", e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="form-input text-xs font-mono"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Aktif</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handle("email", e.target.value)}
                placeholder="email@domain.com"
                className="form-input text-xs"
              />
            </div>

            {/* Status Pekerjaan (f8) */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status Aktivitas *</label>
              <select
                value={formData.f8}
                onChange={(e) => handle("f8", e.target.value)}
                className="form-input text-xs font-bold text-[#0F2042]"
              >
                <option value="1">Bekerja</option>
                <option value="3">Wirausaha / Freelance</option>
                <option value="4">Melanjutkan Pendidikan</option>
                <option value="2">Belum Memungkinkan Bekerja</option>
                <option value="5">Sedang Mencari Kerja</option>
              </select>
            </div>

            {/* Masa Tunggu (f502) */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Masa Tunggu Kerja (Bulan)</label>
              <input
                type="number"
                min="0"
                value={formData.f502}
                onChange={(e) => handle("f502", e.target.value)}
                placeholder="Contoh: 2"
                className="form-input text-xs"
              />
            </div>

            {/* Pendapatan (f505) */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pendapatan Per Bulan (Rp)</label>
              <input
                type="number"
                value={formData.f505}
                onChange={(e) => handle("f505", e.target.value)}
                placeholder="Contoh: 8500000"
                className="form-input text-xs font-mono"
              />
            </div>

            {/* Perusahaan (f5b) */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Perusahaan / Instansi</label>
              <input
                type="text"
                value={formData.f5b}
                onChange={(e) => handle("f5b", e.target.value)}
                placeholder="Contoh: PT Telkom Indonesia"
                className="form-input text-xs"
              />
            </div>
          </div>

          {/* Footer controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost text-xs py-2 px-4"
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-primary text-xs py-2 px-5 bg-[#0F2042] hover:bg-[#1B3A7A]"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? "Simpan Perubahan" : "Simpan Responden"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

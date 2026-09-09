import React from "react";
import { TAU_PRODI_LIST, KODE_PT_TAU } from "../../data/tauProdi";
import { getQuestionnaireYearConfig } from "../../utils/storage";
import { AlertCircle } from "lucide-react";

function FormField({ label, required, children, error, hint }) {
  return (
    <div>
      <label className="block text-xs sm:text-sm font-semibold text-tau-text mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
      {hint && !error && <p className="text-xs text-tau-muted mt-1">{hint}</p>}
    </div>
  );
}

export default function Step1Identity({ formData, setFormData, errors }) {
  const yearConfig = getQuestionnaireYearConfig();
  const graduationYears = yearConfig.availableYears;

  const handle = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-tau-text">Data Diri Alumni</h2>
        <p className="text-xs sm:text-sm text-tau-muted mt-0.5">Lengkapi identitas dan informasi kontak aktif Anda.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {/* Perguruan Tinggi (readonly) */}
        <FormField label="Perguruan Tinggi">
          <input
            type="text"
            readOnly
            value={`Tanri Abeng University (Kode: ${KODE_PT_TAU})`}
            className="form-input bg-tau-blue-soft text-tau-muted cursor-not-allowed"
          />
        </FormField>

        {/* Program Studi */}
        <FormField label="Program Studi" required error={errors?.kdpst}>
          <select
            id="input-kdpst"
            value={formData.kdpst || ""}
            onChange={(e) => handle("kdpst", e.target.value)}
            className={`form-input ${errors?.kdpst ? "border-red-400 ring-1 ring-red-400" : ""}`}
          >
            <option value="">-- Pilih Program Studi --</option>
            {TAU_PRODI_LIST.map((p) => (
              <option key={p.kode} value={p.kode}>{p.nama}</option>
            ))}
          </select>
        </FormField>

        {/* NIM */}
        <FormField label="NIM (Nomor Induk Mahasiswa)" required error={errors?.nim}>
          <input
            id="input-nim"
            type="text"
            placeholder="Contoh: 112020001"
            value={formData.nim || ""}
            onChange={(e) => handle("nim", e.target.value.replace(/\D/g, ""))}
            className={`form-input font-mono ${errors?.nim ? "border-red-400 ring-1 ring-red-400" : ""}`}
          />
        </FormField>

        {/* Tahun Lulus */}
        <FormField label="Tahun Lulus / Wisuda" required error={errors?.tahun_lulus}>
          <select
            id="input-tahun_lulus"
            value={formData.tahun_lulus || ""}
            onChange={(e) => handle("tahun_lulus", e.target.value)}
            className={`form-input ${errors?.tahun_lulus ? "border-red-400 ring-1 ring-red-400" : ""}`}
          >
            <option value="">-- Pilih Tahun Lulus --</option>
            {graduationYears.map((y) => (
              <option key={y} value={String(y)}>Tahun {y}</option>
            ))}
          </select>
        </FormField>

        {/* Nama Lengkap */}
        <div className="sm:col-span-2">
          <FormField label="Nama Lengkap (Sesuai Ijazah)" required error={errors?.nama}>
            <input
              id="input-nama"
              type="text"
              placeholder="Contoh: Muhammad Kevin Ardiansyah, S.Kom."
              value={formData.nama || ""}
              onChange={(e) => handle("nama", e.target.value)}
              className={`form-input ${errors?.nama ? "border-red-400 ring-1 ring-red-400" : ""}`}
            />
          </FormField>
        </div>

        {/* NIK */}
        <FormField
          label="NIK (Nomor Induk Kependudukan)"
          required
          error={errors?.nik}
          hint={`${formData.nik?.length || 0}/16 digit`}
        >
          <input
            id="input-nik"
            type="text"
            maxLength={16}
            placeholder="16 digit sesuai KTP"
            value={formData.nik || ""}
            onChange={(e) => handle("nik", e.target.value.replace(/\D/g, ""))}
            className={`form-input font-mono ${errors?.nik ? "border-red-400 ring-1 ring-red-400" : ""}`}
          />
        </FormField>

        {/* NPWP */}
        <FormField label="NPWP (Opsional)" hint="15 atau 16 digit, kosongkan jika belum punya">
          <input
            id="input-npwp"
            type="text"
            maxLength={16}
            placeholder="Nomor NPWP (opsional)"
            value={formData.npwp || ""}
            onChange={(e) => handle("npwp", e.target.value.replace(/\D/g, ""))}
            className="form-input font-mono"
          />
        </FormField>

        {/* No HP */}
        <FormField label="Nomor WhatsApp / HP Aktif" required error={errors?.hp}>
          <input
            id="input-hp"
            type="text"
            placeholder="08xxxxxxxxxx"
            value={formData.hp || ""}
            onChange={(e) => handle("hp", e.target.value.replace(/\D/g, ""))}
            className={`form-input font-mono ${errors?.hp ? "border-red-400 ring-1 ring-red-400" : ""}`}
          />
        </FormField>

        {/* Email */}
        <FormField label="Alamat Email Aktif" required error={errors?.email}>
          <input
            id="input-email"
            type="email"
            placeholder="nama@email.com"
            value={formData.email || ""}
            onChange={(e) => handle("email", e.target.value)}
            className={`form-input ${errors?.email ? "border-red-400 ring-1 ring-red-400" : ""}`}
          />
        </FormField>
      </div>
    </div>
  );
}

import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const STATUS_OPTIONS = [
  {
    value: "1",
    title: "Bekerja",
    desc: "Karyawan fulltime atau parttime di perusahaan, instansi pemerintah, BUMN, atau organisasi.",
  },
  {
    value: "3",
    title: "Wirausaha / Berwirausaha",
    desc: "Memiliki usaha sendiri, founder/pemilik bisnis, atau bekerja secara mandiri (freelance).",
  },
  {
    value: "4",
    title: "Melanjutkan Pendidikan",
    desc: "Sedang menempuh studi lanjut (Magister S2, Pendidikan Profesi, atau Doktoral S3).",
  },
  {
    value: "2",
    title: "Belum Memungkinkan Bekerja",
    desc: "Alasan keluarga, kesehatan, atau kondisi pribadi lainnya.",
  },
  {
    value: "5",
    title: "Sedang Mencari Pekerjaan",
    desc: "Sedang aktif melamar pekerjaan atau menunggu hasil rekrutmen saat ini.",
  },
];

export default function Step2JobStatus({ formData, setFormData, errors }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[#0F172A]">Status Saat Ini</h2>
        <p className="text-xs md:text-sm text-slate-500 mt-0.5">
          Pilih satu kondisi yang paling sesuai dengan aktivitas Anda saat ini. Pertanyaan berikutnya akan menyesuaikan secara otomatis.
        </p>
      </div>

      {errors?.f8 && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errors.f8}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {STATUS_OPTIONS.map((opt) => {
          const isSelected = formData.f8 === opt.value;
          return (
            <div
              key={opt.value}
              id={`option-f8-${opt.value}`}
              onClick={() => setFormData((prev) => ({ ...prev, f8: opt.value }))}
              className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                isSelected
                  ? "border-[#1B3A7A] bg-[#EFF6FF] shadow-xs ring-1 ring-[#1B3A7A]"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm ${isSelected ? "text-[#1B3A7A]" : "text-[#0F172A]"}`}>
                  {opt.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {opt.desc}
                </p>
              </div>
              <div className="shrink-0">
                {isSelected ? (
                  <CheckCircle2 className="w-5 h-5 text-[#1B3A7A]" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-300 bg-white" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

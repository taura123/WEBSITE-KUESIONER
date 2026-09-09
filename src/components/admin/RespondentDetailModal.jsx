import React from "react";
import { X, User, ShieldCheck } from "lucide-react";
import { TAU_PRODI_LIST } from "../../data/tauProdi";
import { KOMPETENSI_F13 } from "../../data/kemendiktiSchema";
import { getF8Label, formatRupiah, getF11Label } from "../../utils/formatters";

export default function RespondentDetailModal({ respondent, onClose }) {
  if (!respondent) return null;

  const prodiObj = TAU_PRODI_LIST.find((p) => p.kode === respondent.kdpst);
  const prodiName = prodiObj ? prodiObj.nama : respondent.kdpst;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden my-8 max-h-[90vh] flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-[#0F2042] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sky-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">{respondent.nama}</h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-200 border border-sky-400/30">
                  {getF8Label(respondent.f8)}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                NIM: {respondent.nim} · {prodiName} · Lulus {respondent.tahun_lulus}
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* 1. Identitas & Kontak */}
          <div className="space-y-2">
            <p className="section-label">1. Identitas & Kontak</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[11px]">NIK (16 Digit)</span>
                <span className="font-mono font-semibold text-[#0F172A]">{respondent.nik || "-"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">NPWP</span>
                <span className="font-mono font-semibold text-[#0F172A]">{respondent.npwp || "Tanpa NPWP"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Nomor WhatsApp</span>
                <span className="font-mono font-semibold text-[#0F172A]">{respondent.hp || "-"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Email</span>
                <span className="font-semibold text-[#0F172A] truncate block">{respondent.email || "-"}</span>
              </div>
            </div>
          </div>

          {/* 2. Status Karir & Pekerjaan */}
          <div className="space-y-2">
            <p className="section-label">2. Status Karir & Pekerjaan</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[11px]">Instansi / Perusahaan</span>
                <span className="font-semibold text-[#0F172A]">
                  {respondent.f5b || respondent.f5c || (respondent.f8 === "4" ? (respondent.f18b || "-") : "-")}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Pendapatan Bulanan</span>
                <span className="font-bold text-green-700">{respondent.f505 ? formatRupiah(respondent.f505) : "-"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Masa Tunggu</span>
                <span className="font-semibold text-[#0F172A]">
                  {respondent.f502 !== "" && respondent.f502 !== undefined ? `${respondent.f502} Bulan` : "-"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Lokasi</span>
                <span className="font-semibold text-[#0F172A]">
                  {respondent.f5a2 || respondent.f5a1 || "-"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Keterkaitan Studi</span>
                <span className="font-semibold text-[#0F172A]">{getF11Label(respondent)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Waktu Submit</span>
                <span className="font-semibold text-[#0F172A]">
                  {respondent.submittedAt ? new Date(respondent.submittedAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Evaluasi Kompetensi (No Gold/Yellow - Clean Navy & Blue) */}
          <div className="space-y-2">
            <p className="section-label">3. Nilai Evaluasi Kompetensi (Skala 1 - 5)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {KOMPETENSI_F13.map((k) => {
                const valA = respondent[`${k.code.toLowerCase()}a`] || "-";
                const valB = respondent[`${k.code.toLowerCase()}b`] || "-";
                return (
                  <div
                    key={k.code}
                    className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between shadow-xs"
                  >
                    <span className="font-medium text-[#0F172A]">{k.label}</span>
                    <div className="flex items-center gap-1.5 font-bold font-mono text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[#0F2042] border border-slate-200">
                        Saat Lulus: {valA}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-[#1D4ED8] border border-blue-200">
                        Kerja: {valB}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button onClick={onClose} className="btn-secondary text-xs py-2 px-5">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

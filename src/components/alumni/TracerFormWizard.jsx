import React, { useState, useEffect } from "react";
import Step1Identity from "./Step1Identity";
import Step2JobStatus from "./Step2JobStatus";
import Step3CareerDetail from "./Step3CareerDetail";
import Step4Competency from "./Step4Competency";
import Step5CareerChannel from "./Step5CareerChannel";
import SubmissionSuccessModal from "./SubmissionSuccessModal";
import { saveResponse, saveDraft, getDraft, clearDraft } from "../../utils/storage";
import { Check, ChevronRight, ChevronLeft, Send, RotateCcw } from "lucide-react";

const INITIAL = {
  kdptim: "031041",
  kdpst: "",
  nim: "",
  nama: "",
  hp: "",
  email: "",
  nik: "",
  npwp: "",
  tahun_lulus: String(new Date().getFullYear()),
  
  // Q1
  f8: "1",
  // Q2, Q3, Q4, Q6, Q7, Q8
  f502: "",
  f505: "",
  f5a1: "",
  f5a2: "",
  f1101: "",
  f1102: "",
  f5b: "",
  f5c: "",
  f5d: "",
  
  // Q9
  f18a: "",
  f18b: "",
  f18c: "",
  f18d: "",
  
  // Q10
  f1201: "",
  f1202: "",
  
  // Q11, Q12
  f14: "",
  f15: "",
  
  // Q13
  f1761: "4", f1762: "5",
  f1763: "4", f1764: "5",
  f1765: "3", f1766: "4",
  f1767: "4", f1768: "5",
  f1769: "4", f1770: "5",
  f1771: "4", f1772: "5",
  f1773: "4", f1774: "5",
  
  // Q14
  f21: "3", f22: "3", f23: "3", f24: "3", f25: "3", f26: "3", f27: "3",
  
  // Q15
  f301: "", f302: "", f303: "0",
  
  // Q16
  f401: "0", f402: "0", f403: "0", f404: "0", f405: "0", f406: "0", f407: "0", f408: "0", f409: "0", f410: "0", f411: "0", f412: "0", f413: "0", f414: "0", f415: "0", f416: "",
  
  // Q17, Q18, Q19
  f6: "", f7: "", f7a: "",
  
  // Q20
  f1001: "", f1002: "",
  
  // Q21
  f1601: "0", f1602: "0", f1603: "0", f1604: "0", f1605: "0", f1606: "0", f1607: "0", f1608: "0", f1609: "0", f1610: "0", f1611: "0", f1612: "0", f1613: "0", f1614: ""
};

const STEPS = [
  { id: 1, title: "Data Diri", shortTitle: "Diri" },
  { id: 2, title: "Status Saat Ini", shortTitle: "Status" },
  { id: 3, title: "Detail Karir / Studi", shortTitle: "Karir" },
  { id: 4, title: "Kompetensi & Metode", shortTitle: "Kompetensi" },
  { id: 5, title: "Pencarian Karir", shortTitle: "Cari Kerja" },
];

export default function TracerFormWizard({ onSubmittedSuccess }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    const d = getDraft();
    if (d) setFormData({ ...INITIAL, ...d });
  }, []);

  // Silent auto-save to prevent any jitter / layout shifts
  useEffect(() => {
    if (!done) {
      saveDraft(formData);
    }
  }, [formData, done]);

  const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (!formData.nim || formData.nim.length < 5) e.nim = "NIM minimal 5 digit.";
      if (!formData.nama) e.nama = "Nama lengkap wajib diisi.";
      if (!formData.kdpst) e.kdpst = "Pilih program studi Anda.";
      if (!formData.tahun_lulus) e.tahun_lulus = "Pilih tahun kelulusan.";
      if (!formData.nik || formData.nik.length !== 16) e.nik = "NIK harus tepat 16 digit angka.";
      if (!formData.hp || formData.hp.length < 9) e.hp = "Nomor WhatsApp/HP aktif wajib diisi.";
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Format email tidak valid.";
    }
    if (s === 2) {
      if (!formData.f8) e.f8 = "Pilih salah satu status pekerjaan Anda.";
    }
    if (s === 3) {
      if (formData.f8 !== "4") {
        if (!formData.f1201) e.f1201 = "Sumber biaya kuliah wajib diisi.";
        if (formData.f1201 === "7" && !formData.f1202) e.f1202 = "Sebutkan sumber dana lainnya.";
      }
      
      if (formData.f8 === "1" || formData.f8 === "3") {
        if (formData.f502 === "" || isNaN(formData.f502)) e.f502 = "Masa tunggu wajib diisi.";
        if (!formData.f505) e.f505 = "Pendapatan per bulan wajib diisi.";
      }
      
      if (formData.f8 === "1") {
        if (!formData.f5b) e.f5b = "Nama instansi/perusahaan wajib diisi.";
        if (!formData.f14) e.f14 = "Hubungan bidang studi wajib diisi.";
        if (!formData.f15) e.f15 = "Tingkat pendidikan yang tepat wajib diisi.";
      }
      if (formData.f8 === "3") {
        if (!formData.f5c) e.f5c = "Posisi/jabatan wiraswasta wajib diisi.";
      }

      // Validasi untuk Lanjut Studi (f8 = 4)
      if (formData.f8 === "4") {
        if (!formData.f18a) e.f18a = "Sumber biaya studi lanjut wajib diisi.";
        if (!formData.f18b) e.f18b = "Nama perguruan tinggi wajib diisi.";
        if (!formData.f18c) e.f18c = "Program studi wajib diisi.";
      }
    }
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate(step)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setStep((p) => Math.min(p + 1, 5));
    }
  };

  const back = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStep((p) => Math.max(p - 1, 1));
  };

  const handleOpenConfirmModal = (e) => {
    if (e) e.preventDefault();
    if (validate(step)) {
      setIsConfirmModalOpen(true);
    }
  };

  const handleFinalSubmit = async () => {
    setIsConfirmModalOpen(false);
    const saved = await saveResponse(formData);
    clearDraft();
    setSubmittedData(saved);
    setDone(true);
    if (onSubmittedSuccess) onSubmittedSuccess(saved);
  };

  const reset = () => {
    clearDraft();
    setFormData(INITIAL);
    setStep(1);
    setDone(false);
    setSubmittedData(null);
    setIsConfirmModalOpen(false);
  };

  if (done && submittedData) {
    return <SubmissionSuccessModal onReset={reset} />;
  }

  const progress = ((step - 1) / 4) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-3 sm:space-y-5">
      {/* Top Card */}
      <div className="card p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-base sm:text-xl font-bold text-[#0F172A] leading-tight">Kuesioner Tracer Study Tanri Abeng University</h1>
          <p className="text-[11px] sm:text-sm text-slate-500 mt-0.5">
            Tanri Abeng University · Standar Kemendiktisaintek RI
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="btn-ghost text-xs self-start sm:self-auto shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Stepper */}
      <div className="card p-3 sm:p-4">
        {/* Mobile: Current step indicator */}
        <div className="sm:hidden flex items-center justify-between mb-2.5 px-1">
          <span className="text-xs font-bold text-[#1B3A7A]">
            Langkah {step} dari 5
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {STEPS[step - 1].title}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-3">
          {STEPS.map((s) => {
            const doneStep = step > s.id;
            const activeStep = step === s.id;
            return (
              <div
                key={s.id}
                onClick={() => s.id < step && setStep(s.id)}
                className={`flex flex-col items-center gap-1 sm:gap-1.5 transition-opacity ${
                  s.id > step ? "opacity-40 cursor-default" : "cursor-pointer"
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs transition-all ${
                    doneStep
                      ? "bg-green-600 text-white"
                      : activeStep
                      ? "bg-[#1B3A7A] text-white shadow-xs"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {doneStep ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : s.id}
                </div>
                <span
                  className={`text-[9px] sm:text-[11px] font-semibold text-center leading-tight ${
                    activeStep ? "text-[#1B3A7A]" : doneStep ? "text-green-700" : "text-slate-500"
                  }`}
                >
                  <span className="hidden sm:inline">{s.title}</span>
                  <span className="sm:hidden">{s.shortTitle}</span>
                </span>
              </div>
            );
          })}
        </div>

        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1B3A7A] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Form Card */}
      <div className="card p-4 sm:p-6 md:p-8">
        <form onSubmit={(e) => { e.preventDefault(); if (step === 5) handleOpenConfirmModal(e); }}>
          {step === 1 && <Step1Identity formData={formData} setFormData={setFormData} errors={errors} />}
          {step === 2 && <Step2JobStatus formData={formData} setFormData={setFormData} errors={errors} />}
          {step === 3 && <Step3CareerDetail formData={formData} setFormData={setFormData} errors={errors} />}
          {step === 4 && <Step4Competency formData={formData} setFormData={setFormData} />}
          {step === 5 && <Step5CareerChannel formData={formData} setFormData={setFormData} />}

          {/* Navigation Controls */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-slate-200 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button type="button" id="btn-prev-step" onClick={back} className="btn-secondary text-xs sm:text-sm py-2.5 sm:py-2.5 px-3 sm:px-5">
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Sebelumnya</span>
                <span className="sm:hidden">Kembali</span>
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button type="button" id="btn-next-step" onClick={next} className="btn-primary text-xs sm:text-sm py-2.5 sm:py-2.5 px-4 sm:px-5">
                <span>Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                id="btn-submit-tracer"
                onClick={handleOpenConfirmModal}
                className="btn-primary bg-green-700 hover:bg-green-800 px-4 sm:px-6 py-2.5 text-xs sm:text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Kuesioner</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Pop-up Konfirmasi Sebelum Submit */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 border border-slate-100">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 text-[#1B3A7A] flex items-center justify-center mx-auto font-bold text-lg sm:text-xl">
              ?
            </div>
            
            <div className="text-center space-y-1.5 sm:space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Konfirmasi Pengiriman Kuesioner</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Apakah Anda yakin data kuesioner yang Anda isikan sudah benar dan sesuai dengan kondisi Anda saat ini?
              </p>
            </div>

            <div className="p-2.5 sm:p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] sm:text-xs text-amber-800 text-center">
              Data yang dikirim akan direkam secara resmi untuk laporan Tracer Study Tanri Abeng University.
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2 pb-2 sm:pb-0">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="btn-secondary w-1/2 py-2.5 sm:py-2.5 text-xs font-semibold justify-center"
              >
                Periksa Kembali
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="btn-primary w-1/2 py-2.5 sm:py-2.5 text-xs font-semibold bg-green-700 hover:bg-green-800 justify-center shadow-md"
              >
                Ya, Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React from "react";
import { KOMPETENSI_F13, METODE_F14 } from "../../data/kemendiktiSchema";
import { BrainCircuit, BookOpen } from "lucide-react";

export default function Step4Competency({ formData, setFormData }) {
  const handleChange = (varName, value) => {
    setFormData((prev) => ({ ...prev, [varName]: value }));
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="pb-3 sm:pb-4 border-b border-slate-200">
        <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">Evaluasi Kompetensi & Pembelajaran</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Beri penilaian objektif terhadap kompetensi yang Anda miliki saat lulus dan relevansinya di tempat kerja, serta metode pembelajaran selama kuliah.
        </p>
      </div>

      <div className="bg-blue-50/50 rounded-xl p-3 sm:p-4 border border-blue-100 flex items-start gap-2.5 sm:gap-3">
        <BrainCircuit className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-[#0F172A]">
            Evaluasi Kompetensi Pribadi (Skala 1 - 5)
          </h3>
          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 leading-relaxed">
            <strong>Skala 1:</strong> Sangat Rendah - <strong>Skala 5:</strong> Sangat Tinggi.<br />
            <strong>A</strong> = Tingkat penguasaan saat lulus | <strong>B</strong> = Tingkat yang diperlukan dalam pekerjaan saat ini.
          </p>
        </div>
      </div>

      {/* Desktop: Table | Mobile: Cards */}
      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full text-left text-xs bg-white min-w-[600px]">
          <thead className="bg-[#0F2042] text-white">
            <tr>
              <th className="px-4 py-3 font-semibold rounded-tl-xl w-1/3">Kompetensi</th>
              <th className="px-4 py-3 font-semibold text-center bg-[#1B3A7A]">A. Penguasaan Saat Lulus</th>
              <th className="px-4 py-3 font-semibold text-center rounded-tr-xl">B. Kebutuhan di Pekerjaan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {KOMPETENSI_F13.map((k) => (
              <tr key={k.code} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="font-bold text-slate-800">{k.label}</div>
                  <div className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">{k.desc}</div>
                </td>
                <td className="px-4 py-3 bg-slate-50/30">
                  <div className="flex justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={`${k.varA}-${val}`}
                        type="button"
                        onClick={() => handleChange(k.varA, String(val))}
                        className={`w-7 h-7 rounded text-[11px] font-bold transition-all border ${
                          formData[k.varA] === String(val)
                            ? "bg-[#1B3A7A] border-[#1B3A7A] text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-400 hover:border-[#1B3A7A] hover:text-[#1B3A7A]"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={`${k.varB}-${val}`}
                        type="button"
                        onClick={() => handleChange(k.varB, String(val))}
                        className={`w-7 h-7 rounded text-[11px] font-bold transition-all border ${
                          formData[k.varB] === String(val)
                            ? "bg-sky-600 border-sky-600 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-400 hover:border-sky-500 hover:text-sky-500"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {KOMPETENSI_F13.map((k) => (
          <div key={k.code} className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-3">
            <div>
              <div className="font-bold text-xs text-slate-800">{k.label}</div>
              <div className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">{k.desc}</div>
            </div>
            {/* A: Saat Lulus */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#1B3A7A] uppercase tracking-wider">A. Saat Lulus</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={`m-${k.varA}-${val}`}
                    type="button"
                    onClick={() => handleChange(k.varA, String(val))}
                    className={`flex-1 h-8 rounded-lg text-[11px] font-bold transition-all border ${
                      formData[k.varA] === String(val)
                        ? "bg-[#1B3A7A] border-[#1B3A7A] text-white shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
            {/* B: Kebutuhan Kerja */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">B. Kebutuhan Kerja</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={`m-${k.varB}-${val}`}
                    type="button"
                    onClick={() => handleChange(k.varB, String(val))}
                    className={`flex-1 h-8 rounded-lg text-[11px] font-bold transition-all border ${
                      formData[k.varB] === String(val)
                        ? "bg-sky-600 border-sky-600 text-white shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 sm:pt-6 border-t border-slate-200">
        <div className="bg-emerald-50/50 rounded-xl p-3 sm:p-4 border border-emerald-100 flex items-start gap-2.5 sm:gap-3 mb-4">
          <BookOpen className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#0F172A]">
              Penekanan Metode Pembelajaran (Skala 1 - 5)
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 leading-relaxed">
              Menurut Anda, seberapa besar penekanan pada metode pembelajaran di bawah ini dilaksanakan di program studi Anda?<br />
              <strong>1:</strong> Tidak Sama Sekali - <strong>3:</strong> Cukup Besar - <strong>5:</strong> Sangat Besar
            </p>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
          <table className="w-full text-left text-xs bg-white min-w-[500px]">
            <thead className="bg-[#0F172A] text-white">
              <tr>
                <th className="px-4 py-3 font-semibold rounded-tl-xl w-1/2">Metode Pembelajaran</th>
                <th className="px-4 py-3 font-semibold text-center rounded-tr-xl">Tingkat Penekanan (1 - 5)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {METODE_F14.map((m) => (
                <tr key={m.varKemendikti} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-800">{m.label}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={`${m.varKemendikti}-${val}`}
                          type="button"
                          onClick={() => handleChange(m.varKemendikti, String(val))}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border ${
                            formData[m.varKemendikti] === String(val)
                              ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                              : "bg-white border-slate-200 text-slate-400 hover:border-emerald-500 hover:text-emerald-500"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-3">
          {METODE_F14.map((m) => (
            <div key={m.varKemendikti} className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2.5">
              <div className="font-bold text-xs text-slate-800">{m.label}</div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={`m-${m.varKemendikti}-${val}`}
                    type="button"
                    onClick={() => handleChange(m.varKemendikti, String(val))}
                    className={`flex-1 h-8 rounded-lg text-[11px] font-bold transition-all border ${
                      formData[m.varKemendikti] === String(val)
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

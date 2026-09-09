import React from "react";
import { CARA_MENCARI_KERJA_F4, ALASAN_TIDAK_SESUAI_F16 } from "../../data/kemendiktiSchema";
import { Clock, Info, Mail, MessageSquare, AlertTriangle, Search } from "lucide-react";

const FormField = ({ label, id, value, onChange, placeholder, type = "number", min = "0" }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-semibold text-slate-700 leading-snug">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      min={min}
      value={value}
      onChange={onChange}
      className="form-input w-full bg-white border border-slate-200 focus:border-[#1B3A7A] focus:ring-[#1B3A7A]/20 font-medium"
      placeholder={placeholder}
    />
  </div>
);

export default function Step5CareerChannel({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked ? "1" : "0" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // F301 = kode pilihan: "1"=sebelum lulus, "2"=sesudah lulus, "3"=tidak mencari
  // F302 = jumlah bulan sebelum lulus (hanya jika F301="1")
  // F303 = jumlah bulan sesudah lulus (hanya jika F301="2")
  const f301Value = String(formData.f301 || "");

  return (
    <div className="space-y-5 sm:space-y-8 animate-fade-in text-slate-800">
      <div className="pb-3 sm:pb-4 border-b border-slate-200">
        <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">Aktivitas Pencarian Karir</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Semua responden mengisi bagian ini. Pilih jawaban yang paling sesuai dengan kondisi Anda.
        </p>
      </div>

      {/* ── Q15: Kapan mulai mencari pekerjaan ───────────────────────────
           F301 = pilihan 1/2/3
           F302 = bulan sebelum lulus (jika F301=1)
           F303 = bulan sesudah lulus  (jika F301=2)
      ─────────────────────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
        <h3 className="font-bold text-[#0F172A] flex items-center gap-2 text-sm md:text-base">
          <Clock className="w-5 h-5 text-[#1B3A7A] shrink-0" />
          <span>
            Kapan Anda mulai mencari pekerjaan?{" "}
            <span className="text-xs text-slate-400 font-normal">(Pekerjaan sambilan tidak dimasukkan)</span>
          </span>
        </h3>

        <div className="space-y-4 pl-2 sm:pl-7">

          {/* Pilihan F301 = "1": sebelum lulus → isi F302 */}
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="f301_choice"
                value="1"
                checked={f301Value === "1"}
                onChange={() => setFormData((p) => ({ ...p, f301: "1", f302: "", f303: "" }))}
                className="w-4 h-4 text-[#1B3A7A] shrink-0 focus:ring-[#1B3A7A]"
              />
              <span className="text-sm text-slate-700">
                Kira-kira berapa bulan <strong className="text-slate-900">sebelum</strong> lulus
              </span>
            </label>
            {f301Value === "1" && (
              <div className="pl-7 flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  name="f302"
                  id="f302"
                  value={formData.f302}
                  onChange={handleChange}
                  className="w-28 h-9 text-center text-sm border border-slate-300 rounded-lg font-bold focus:border-[#1B3A7A] focus:ring-1 focus:ring-[#1B3A7A]/20"
                  placeholder="0"
                />
                <span className="text-sm text-slate-500">bulan sebelum lulus</span>
              </div>
            )}
          </div>

          {/* Pilihan F301 = "2": sesudah lulus → isi F303 */}
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="f301_choice"
                value="2"
                checked={f301Value === "2"}
                onChange={() => setFormData((p) => ({ ...p, f301: "2", f302: "", f303: "" }))}
                className="w-4 h-4 text-[#1B3A7A] shrink-0 focus:ring-[#1B3A7A]"
              />
              <span className="text-sm text-slate-700">
                Kira-kira berapa bulan <strong className="text-slate-900">sesudah</strong> lulus
              </span>
            </label>
            {f301Value === "2" && (
              <div className="pl-7 flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  name="f303"
                  id="f303"
                  value={formData.f303}
                  onChange={handleChange}
                  className="w-28 h-9 text-center text-sm border border-slate-300 rounded-lg font-bold focus:border-[#1B3A7A] focus:ring-1 focus:ring-[#1B3A7A]/20"
                  placeholder="0"
                />
                <span className="text-sm text-slate-500">bulan sesudah lulus</span>
              </div>
            )}
          </div>

          {/* Pilihan F301 = "3": tidak mencari kerja */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="f301_choice"
              value="3"
              checked={f301Value === "3"}
              onChange={() => setFormData((p) => ({ ...p, f301: "3", f302: "", f303: "" }))}
              className="w-4 h-4 text-[#1B3A7A] shrink-0 focus:ring-[#1B3A7A]"
            />
            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
              Saya tidak mencari kerja
            </span>
          </label>

        </div>
      </div>

      {/* ── Q16: Bagaimana mencari pekerjaan (tampil jika F301 ≠ "3") ─── */}
      {f301Value !== "3" && (
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-bold text-[#0F172A] flex items-center gap-2 text-sm md:text-base">
              <Search className="w-5 h-5 text-[#1B3A7A] shrink-0" />
              <span>Bagaimana Anda mencari pekerjaan tersebut?</span>
            </h3>
            <span className="px-2.5 py-1 bg-white border border-slate-200 text-[11px] font-bold text-[#1B3A7A] rounded-full self-start sm:self-auto">
              Bisa Pilih Lebih Dari Satu
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3.5 gap-x-5 pl-2 sm:pl-7 pt-1">
            {CARA_MENCARI_KERJA_F4.map((opt) => (
              <label
                key={opt.code}
                className="flex items-start gap-3 cursor-pointer group p-1 rounded-md hover:bg-white transition-colors"
              >
                <input
                  type="checkbox"
                  name={opt.code}
                  checked={formData[opt.code] === "1"}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 text-[#1B3A7A] rounded border-slate-300 focus:ring-[#1B3A7A] shrink-0"
                />
                <span className="text-xs md:text-sm text-slate-700 group-hover:text-slate-900 leading-snug">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
          {/* F416: isian lainnya jika F415 dipilih */}
          {formData.f415 === "1" && (
            <div className="pl-2 sm:pl-7 mt-3">
              <FormField
                id="f416"
                type="text"
                label="Sebutkan jalur lainnya:"
                value={formData.f416}
                onChange={handleChange}
                placeholder="Misal: Platform freelance tertentu..."
              />
            </div>
          )}
        </div>
      )}

      {/* ── Q17, Q18, Q19: Jumlah lamaran — SEMUA responden ────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3">
        <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <Mail className="w-5 h-5 text-[#1B3A7A] mb-2" />
          <FormField
            id="f6"
            label="Berapa instansi yang sudah Anda lamar sebelum memperoleh pekerjaan pertama?"
            value={formData.f6}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
        <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <Info className="w-5 h-5 text-sky-600 mb-2" />
          <FormField
            id="f7"
            label="Berapa banyak instansi yang merespons lamaran Anda?"
            value={formData.f7}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
        <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <MessageSquare className="w-5 h-5 text-emerald-600 mb-2" />
          <FormField
            id="f7a"
            label="Berapa banyak instansi yang mengundang wawancara?"
            value={formData.f7a}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
      </div>

      {/* ── Q20: Aktif mencari pekerjaan 4 minggu terakhir — SEMUA ────── */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
        <h3 className="font-bold text-[#0F172A] text-sm md:text-base">
          Apakah Anda aktif mencari pekerjaan dalam 4 minggu terakhir?
        </h3>
        <select
          name="f1001"
          value={formData.f1001}
          onChange={handleChange}
          className="form-input w-full md:w-2/3 bg-slate-50 border-slate-200 font-medium text-sm"
        >
          <option value="">-- Pilih Jawaban --</option>
          <option value="1">Tidak</option>
          <option value="2">Tidak, tapi saya sedang menunggu hasil lamaran kerja</option>
          <option value="3">Ya, saya akan mulai bekerja dalam 2 minggu ke depan</option>
          <option value="4">Ya, tapi saya belum pasti akan bekerja dalam 2 minggu ke depan</option>
          <option value="5">Lainnya</option>
        </select>
        {/* F1002: wajib jika F1001 = "5" */}
        {formData.f1001 === "5" && (
          <div className="mt-2 w-full md:w-2/3">
            <input
              type="text"
              name="f1002"
              value={formData.f1002}
              onChange={handleChange}
              className="form-input w-full bg-white border border-slate-200 text-sm"
              placeholder="Jelaskan secara singkat..."
            />
          </div>
        )}
      </div>

      {/* ── Q21: Alasan mengambil pekerjaan tidak sesuai — SEMUA ─────── */}
      <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-amber-900 flex items-start gap-2 text-sm md:text-base">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Jika menurut Anda pekerjaan saat ini kurang sesuai/tidak erat dengan pendidikan
              Anda, mengapa Anda mengambilnya?
            </span>
          </h3>
          <span className="px-2 py-1 bg-white border border-amber-200 text-[10px] font-bold text-amber-600 rounded whitespace-nowrap shrink-0">
            Bisa Pilih Lebih Dari Satu
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 pl-2 sm:pl-7">
          {ALASAN_TIDAK_SESUAI_F16.map((opt) => (
            <label key={opt.code} className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name={opt.code}
                checked={formData[opt.code] === "1"}
                onChange={handleChange}
                className="w-4 h-4 mt-0.5 text-amber-600 rounded border-amber-300 focus:ring-amber-500 shrink-0"
              />
              <span className="text-xs md:text-sm text-amber-900/80 group-hover:text-amber-900 leading-snug">
                {opt.label}
              </span>
            </label>
          ))}
        </div>

        {/* F1614: wajib jika F1613 dipilih */}
        {formData.f1613 === "1" && (
          <div className="pl-2 sm:pl-7 mt-3">
            <FormField
              id="f1614"
              type="text"
              label="Tuliskan alasan lainnya:"
              value={formData.f1614}
              onChange={handleChange}
              placeholder="Jelaskan..."
            />
          </div>
        )}
      </div>
    </div>
  );
}


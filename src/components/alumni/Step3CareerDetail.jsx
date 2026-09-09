import React from "react";
import { MapPin, Building2, Briefcase, GraduationCap } from "lucide-react";
import { F1201_OPTIONS, PROVINSI_INDONESIA } from "../../data/kemendiktiSchema";
import { formatNumberWithDots } from "../../utils/formatters";

const FormField = ({ label, id, value, onChange, placeholder, type = "text", error, prefix, required }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-xs sm:text-sm font-semibold text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {prefix && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {prefix}
        </div>
      )}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className={`form-input w-full bg-slate-50 border ${
          error ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-slate-200"
        } ${prefix ? "pl-9" : ""}`}
        placeholder={placeholder}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1 font-medium animate-fade-in">{error}</p>}
  </div>
);

export default function Step3CareerDetail({ formData, setFormData, errors }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isBekerjaOrWiraswasta = formData.f8 === "1" || formData.f8 === "3";
  const isBekerja = formData.f8 === "1";
  const isWiraswasta = formData.f8 === "3";
  const isLanjutStudi = formData.f8 === "4";

  return (
    <div className="space-y-5 sm:space-y-8 animate-fade-in">
      <div className="pb-3 sm:pb-4 border-b border-slate-200">
        <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">Detail Studi & Karir</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Lengkapi informasi tentang sumber pembiayaan studi Anda dan rincian pekerjaan saat ini.
        </p>
      </div>

      {/* Q10: Sumber Pembiayaan Kuliah */}
      {!isLanjutStudi && (
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3 sm:space-y-4">
          <div>
            <h3 className="font-bold text-[#0F172A] flex items-center gap-2 text-sm sm:text-base">
              <GraduationCap className="w-5 h-5 text-[#0F2042] shrink-0" />
              <span>Sebutkan sumber dana dalam pembiayaan kuliah Anda <span className="text-red-500">*</span></span>
            </h3>
          </div>
          <div className="space-y-2.5 pl-2 sm:pl-7">
            {F1201_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="f1201"
                  value={opt.value}
                  checked={formData.f1201 === opt.value}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#1B3A7A] focus:ring-[#1B3A7A] border-slate-300"
                />
                <span className="text-xs sm:text-sm text-slate-700 group-hover:text-slate-900 transition">
                  {opt.label}
                </span>
              </label>
            ))}
            {formData.f1201 === "7" && (
              <div className="mt-3 pl-2 sm:pl-7">
                <FormField
                  id="f1202"
                  label="Tuliskan sumber dana lainnya:"
                  value={formData.f1202}
                  onChange={handleChange}
                  placeholder="Contoh: Pemda, BAZNAS, dll"
                  error={errors.f1202}
                  required
                />
              </div>
            )}
          </div>
          {errors.f1201 && <p className="text-red-500 text-xs mt-1 pl-2 sm:pl-7 font-medium">{errors.f1201}</p>}
        </div>
      )}

      {isBekerjaOrWiraswasta && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/50">
            {/* Q2: Masa Tunggu */}
            <div className="space-y-1.5">
              <label htmlFor="f502" className="block text-xs sm:text-sm font-semibold text-slate-700">
                {formData.f8 === "3"
                  ? "Dalam berapa bulan setelah lulus Anda memulai wiraswasta?"
                  : "Dalam berapa bulan Anda mendapatkan pekerjaan pertama setelah lulus?"}
                {" "}<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="120"
                  id="f502"
                  name="f502"
                  value={formData.f502}
                  onChange={handleChange}
                  className={`form-input w-full pr-16 bg-white border ${
                    errors.f502 ? "border-red-300" : "border-slate-200"
                  }`}
                  placeholder="Misal: 3"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-slate-500 font-medium pointer-events-none">
                  Bulan
                </span>
              </div>
              {errors.f502 && <p className="text-red-500 text-xs">{errors.f502}</p>}
            </div>

            {/* Q3: Pendapatan */}
            <div className="space-y-1.5">
              <label htmlFor="f505" className="block text-xs sm:text-sm font-semibold text-slate-700">
                Rata-rata pendapatan per bulan (Take Home Pay) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">Rp</div>
                <input
                  type="text"
                  id="f505"
                  name="f505"
                  value={formatNumberWithDots(formData.f505)}
                  onChange={(e) => {
                    const cleanDigits = e.target.value.replace(/\D/g, "");
                    setFormData((prev) => ({ ...prev, f505: cleanDigits }));
                  }}
                  className={`form-input w-full pl-9 font-semibold text-slate-900 bg-white border ${
                    errors.f505 ? "border-red-300" : "border-slate-200"
                  }`}
                  placeholder="Contoh: 8.500.000"
                />
              </div>
              {errors.f505 && <p className="text-red-500 text-xs">{errors.f505}</p>}
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4 sm:space-y-6">
            <h3 className="font-bold text-[#0F172A] flex items-center gap-2 mb-2 sm:mb-4 text-sm sm:text-base">
              <Building2 className="w-5 h-5 text-[#0F2042] shrink-0" />
              Detail Tempat Kerja
            </h3>

            {isBekerja && (
              <>
                {/* Q5: Jenis Perusahaan */}
                <div className="space-y-1.5">
                  <label htmlFor="f1101" className="block text-xs sm:text-sm font-semibold text-slate-700">
                    Apa jenis perusahaan/instansi tempat Anda bekerja sekarang?
                  </label>
                  <select
                    id="f1101"
                    name="f1101"
                    value={formData.f1101}
                    onChange={handleChange}
                    className="form-input w-full bg-slate-50 border-slate-200"
                  >
                    <option value="">-- Pilih Jenis Instansi --</option>
                    <option value="1">Instansi pemerintah</option>
                    <option value="2">Organisasi non-profit / LSM</option>
                    <option value="3">Perusahaan swasta</option>
                    <option value="4">Wiraswasta / perusahaan sendiri</option>
                    <option value="6">BUMN / BUMD</option>
                    <option value="7">Institusi / Organisasi Multilateral</option>
                    <option value="5">Lainnya</option>
                  </select>
                </div>
                {formData.f1101 === "5" && (
                  <FormField
                    id="f1102"
                    label="Tuliskan jenis instansi lainnya:"
                    value={formData.f1102}
                    onChange={handleChange}
                    placeholder="Sebutkan..."
                  />
                )}

                {/* Q6: Nama Perusahaan */}
                <FormField
                  id="f5b"
                  label="Apa nama perusahaan/kantor tempat Anda bekerja?"
                  value={formData.f5b}
                  onChange={handleChange}
                  placeholder="PT Jaya Makmur"
                  error={errors.f5b}
                  prefix={<Briefcase className="w-4 h-4" />}
                  required
                />
              </>
            )}

            {isWiraswasta && (
              /* Q7: Jabatan Wiraswasta */
              <div className="space-y-1.5">
                <label htmlFor="f5c" className="block text-xs sm:text-sm font-semibold text-slate-700">
                  Bila berwiraswasta, apa posisi/jabatan Anda saat ini? <span className="text-red-500">*</span>
                </label>
                <select
                  id="f5c"
                  name="f5c"
                  value={formData.f5c}
                  onChange={handleChange}
                  className={`form-input w-full bg-slate-50 border ${
                    errors.f5c ? "border-red-300" : "border-slate-200"
                  }`}
                >
                  <option value="">-- Pilih Posisi --</option>
                  <option value="1">Founder</option>
                  <option value="2">Co-Founder</option>
                  <option value="3">Staff</option>
                  <option value="4">Freelance / Kerja Lepas</option>
                </select>
                {errors.f5c && <p className="text-red-500 text-xs">{errors.f5c}</p>}
              </div>
            )}

            {/* Q8: Tingkat Tempat Kerja */}
            <div className="space-y-1.5">
              <label htmlFor="f5d" className="block text-xs sm:text-sm font-semibold text-slate-700">
                Apa tingkat tempat kerja Anda?
              </label>
              <select
                id="f5d"
                name="f5d"
                value={formData.f5d}
                onChange={handleChange}
                className="form-input w-full bg-slate-50 border-slate-200"
              >
                <option value="">-- Pilih Tingkatan --</option>
                <option value="1">Lokal / Wilayah / Wiraswasta tidak berbadan hukum</option>
                <option value="2">Nasional / Wiraswasta berbadan hukum</option>
                <option value="3">Multinasional / Internasional</option>
              </select>
            </div>

            {/* Q4: Lokasi Kerja - tampil untuk Bekerja dan Wiraswasta */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 pt-4 border-t border-slate-100">
              <div className="space-y-1.5">
                <label htmlFor="f5a1" className="block text-xs sm:text-sm font-semibold text-slate-700">
                  Provinsi Tempat Kerja
                </label>
                <select
                  id="f5a1"
                  name="f5a1"
                  value={formData.f5a1}
                  onChange={handleChange}
                  className="form-input w-full bg-slate-50 border-slate-200"
                >
                  <option value="">-- Pilih Provinsi --</option>
                  {PROVINSI_INDONESIA.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <FormField
                id="f5a2"
                label="Kota / Kabupaten Tempat Kerja"
                value={formData.f5a2}
                onChange={handleChange}
                placeholder="Contoh: Jakarta Selatan"
                prefix={<MapPin className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Q11 & Q12: Erat Hubungan & Kesesuaian Pendidikan (Khusus Bekerja) */}
          {isBekerja && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="space-y-1.5">
                <label htmlFor="f14" className="block text-xs sm:text-sm font-semibold text-slate-700">
                  Seberapa erat hubungan bidang studi dengan pekerjaan Anda? <span className="text-red-500">*</span>
                </label>
                <select
                  id="f14"
                  name="f14"
                  value={formData.f14}
                  onChange={handleChange}
                  className={`form-input w-full bg-white border ${
                    errors.f14 ? "border-red-300" : "border-slate-200"
                  }`}
                >
                  <option value="">-- Pilih Jawaban --</option>
                  <option value="1">Sangat Erat</option>
                  <option value="2">Erat</option>
                  <option value="3">Cukup Erat</option>
                  <option value="4">Kurang Erat</option>
                  <option value="5">Tidak Sama Sekali</option>
                </select>
                {errors.f14 && <p className="text-red-500 text-xs">{errors.f14}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="f15" className="block text-xs sm:text-sm font-semibold text-slate-700">
                  Tingkat pendidikan apa yang paling tepat/sesuai untuk pekerjaan Anda saat ini? <span className="text-red-500">*</span>
                </label>
                <select
                  id="f15"
                  name="f15"
                  value={formData.f15}
                  onChange={handleChange}
                  className={`form-input w-full bg-white border ${
                    errors.f15 ? "border-red-300" : "border-slate-200"
                  }`}
                >
                  <option value="">-- Pilih Jawaban --</option>
                  <option value="1">Setingkat Lebih Tinggi</option>
                  <option value="2">Tingkat yang Sama</option>
                  <option value="3">Setingkat Lebih Rendah</option>
                  <option value="4">Tidak Perlu Pendidikan Tinggi</option>
                </select>
                {errors.f15 && <p className="text-red-500 text-xs">{errors.f15}</p>}
              </div>
            </div>
          )}
        </>
      )}

      {isLanjutStudi && (
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4 sm:space-y-6">
          <h3 className="font-bold text-[#0F172A] flex items-center gap-2 mb-2 sm:mb-4 text-sm sm:text-base">
            <GraduationCap className="w-5 h-5 text-[#0F2042] shrink-0" />
            Informasi Studi Lanjut
          </h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            <div className="space-y-1.5">
              <label htmlFor="f18a" className="block text-xs sm:text-sm font-semibold text-slate-700">
                Sumber Biaya Studi Lanjut <span className="text-red-500">*</span>
              </label>
              <select
                id="f18a"
                name="f18a"
                value={formData.f18a}
                onChange={handleChange}
                className={`form-input w-full bg-slate-50 border ${
                  errors.f18a ? "border-red-300" : "border-slate-200"
                }`}
              >
                <option value="">-- Pilih Sumber Biaya --</option>
                <option value="1">Biaya Sendiri</option>
                <option value="2">Beasiswa</option>
              </select>
              {errors.f18a && <p className="text-red-500 text-xs mt-1 font-medium">{errors.f18a}</p>}
            </div>
            <FormField
              id="f18d"
              type="date"
              label="Tanggal Masuk Studi"
              value={formData.f18d}
              onChange={handleChange}
            />
            <div className="sm:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <FormField
                id="f18b"
                label="Nama Perguruan Tinggi"
                value={formData.f18b}
                onChange={handleChange}
                placeholder="Contoh: Universitas Indonesia"
                error={errors.f18b}
                required
              />
              <FormField
                id="f18c"
                label="Program Studi"
                value={formData.f18c}
                onChange={handleChange}
                placeholder="Contoh: Magister Manajemen"
                error={errors.f18c}
                required
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Upload, FileSpreadsheet, Download, Check, AlertCircle, X, ArrowRight, Table, Sparkles } from "lucide-react";
import { bulkSaveResponses } from "../../utils/storage";

export default function ImportTracerModal({ isOpen, onClose, onDataImported }) {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  // Generate and download a sample Excel file template for Admin
  const handleDownloadSample = () => {
    const sampleRows = [
      {
        "NIM": "112021001",
        "Nama Alumni": "Aditya Pratama, S.Kom.",
        "Email": "aditya.p@example.com",
        "No WhatsApp / HP": "081298765432",
        "NIK": "3171012345670001",
        "NPWP": "123456789012345",
        "Tahun Lulus": "2024",
        "Kode Prodi": "55201",
        "Program Studi": "Teknik Informatika",
        "Status Pekerjaan (1:Bekerja, 2:Wiraswasta, 3:Lanjut Studi, 4:Mencari Kerja)": "1",
        "Masa Tunggu (Bulan)": "2",
        "Pendapatan Per Bulan (Rp)": "8500000",
        "Nama Perusahaan / Instansi": "PT Teknologi Nusantara",
        "Posisi / Jabatan": "Software Engineer",
        "Kesesuaian Bidang Studi (1:Sangat Erat, 2:Erat, 3:Cukup, 4:Kurang, 5:Tidak Erat)": "1"
      },
      {
        "NIM": "112021002",
        "Nama Alumni": "Siti Rahma, S.M.",
        "Email": "siti.rahma@example.com",
        "No WhatsApp / HP": "085612345678",
        "NIK": "3171012345670002",
        "NPWP": "",
        "Tahun Lulus": "2023",
        "Kode Prodi": "61201",
        "Program Studi": "Manajemen",
        "Status Pekerjaan (1:Bekerja, 2:Wiraswasta, 3:Lanjut Studi, 4:Mencari Kerja)": "2",
        "Masa Tunggu (Bulan)": "1",
        "Pendapatan Per Bulan (Rp)": "12000000",
        "Nama Perusahaan / Instansi": "Batik Creative Studio",
        "Posisi / Jabatan": "Founder & Managing Director",
        "Kesesuaian Bidang Studi (1:Sangat Erat, 2:Erat, 3:Cukup, 4:Kurang, 5:Tidak Erat)": "2"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Templat Tracer Study");

    // Auto column width adjustments
    worksheet["!cols"] = [
      { wch: 15 }, { wch: 25 }, { wch: 25 }, { wch: 18 }, { wch: 20 },
      { wch: 18 }, { wch: 12 }, { wch: 12 }, { wch: 22 }, { wch: 30 },
      { wch: 20 }, { wch: 22 }, { wch: 28 }, { wch: 25 }, { wch: 30 }
    ];

    XLSX.writeFile(workbook, "Sample_Template_Tracer_Study_TAU.xlsx");
  };

  // Helper to map spreadsheet keys to DB fields
  const mapRowToSchema = (row) => {
    const findVal = (...keys) => {
      for (const k of keys) {
        const found = Object.keys(row).find(
          (rk) => rk.toLowerCase().trim() === k.toLowerCase().trim() || rk.toLowerCase().includes(k.toLowerCase())
        );
        if (found && row[found] !== undefined && row[found] !== null && String(row[found]).trim() !== "") {
          return String(row[found]).trim();
        }
      }
      return "";
    };

    const nim = findVal("nim", "nomor induk mahasiswa");
    const nama = findVal("nama alumni", "nama", "nama lengkap");
    const email = findVal("email", "alamat email");
    const hp = findVal("no whatsapp / hp", "no hp", "hp", "whatsapp", "telepon");
    const nik = findVal("nik", "nomor induk kependudukan");
    const npwp = findVal("npwp");
    const tahunLulus = findVal("tahun lulus", "tahun_lulus", "tahun wisuda") || "2025";
    const kdpst = findVal("kode prodi", "kdpst", "prodi") || "55201";
    const f8 = findVal("status pekerjaan", "f8", "status kerja") || "1";
    const f502 = findVal("masa tunggu", "f502") || "3";
    const f505 = findVal("pendapatan per bulan", "pendapatan", "gaji", "f505") || "5000000";
    const f5b = findVal("nama perusahaan / instansi", "nama perusahaan", "instansi", "f5b") || "";
    const f5c = findVal("posisi / jabatan", "jabatan", "posisi", "f5c") || "";
    const f14 = findVal("kesesuaian bidang studi", "hubungan bidang studi", "f14") || "1";

    return {
      id: `TAU-${tahunLulus}-${nim || Date.now().toString().slice(-5)}`,
      nim,
      nama,
      email,
      hp,
      nik: nik ? nik.padStart(16, "0").slice(0, 16) : "3171000000000000",
      npwp,
      tahun_lulus: String(tahunLulus),
      kdpst,
      kdptim: "031054",
      f8: ["1", "2", "3", "4"].includes(f8) ? f8 : "1",
      f502,
      f505,
      f5b,
      f5c,
      f14: ["1", "2", "3", "4", "5"].includes(f14) ? f14 : "2",
      f15: "1",
      f1301a: "4", f1301b: "5", f1302a: "4", f1302b: "5",
      f1401: "4", f1402: "4", f1403: "5", f1404: "4", f1405: "5",
      submittedAt: new Date().toISOString()
    };
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setError("");
    setSuccessMessage("");
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawJson = XLSX.utils.sheet_to_json(ws, { defval: "" });

        if (rawJson.length === 0) {
          setError("File Excel / CSV kosong atau format tidak terbaca.");
          setParsedData([]);
          return;
        }

        const mapped = rawJson.map(mapRowToSchema).filter((r) => r.nama && r.nim);
        if (mapped.length === 0) {
          setError("Tidak dapat menemukan baris valid dengan kolom 'NIM' dan 'Nama Alumni'. Sila periksa templat.");
        }
        setParsedData(mapped);
      } catch (err) {
        setError(`Gagal membaca file: ${err.message}`);
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  const handleImportSubmit = async () => {
    if (parsedData.length === 0) return;

    setIsLoading(true);
    setError("");
    try {
      const freshList = await bulkSaveResponses(parsedData);
      setSuccessMessage(`Berhasil mengimpor ${parsedData.length} data responden tracer study!`);
      if (onDataImported) onDataImported(freshList);
      setTimeout(() => {
        onClose();
        setFile(null);
        setParsedData([]);
        setSuccessMessage("");
      }, 1500);
    } catch (e) {
      setError(`Terjadi kesalahan saat menyimpan: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 border border-slate-200">

        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-[#094E96] text-white border-b border-blue-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Upload Data Tracer Study Historis</h3>
              <p className="text-xs text-blue-200 mt-0.5">
                Impor data lulusan dari tahun-tahun sebelumnya (.xlsx, .xls, .csv)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Action step 1: Download Template */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-blue-900">
            <div className="space-y-1">
              <span className="font-bold text-blue-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-600" />
                Belum Punya Format File Excel?
              </span>
              <p className="text-blue-800 text-[11px]">
                Unduh templat resmi Excel Tracer Study TAU untuk memastikan header kolom sesuai secara otomatis.
              </p>
            </div>
            <button
              onClick={handleDownloadSample}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-blue-100 text-[#094E96] border border-blue-300 font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <Download className="w-4 h-4 text-sky-600" />
              <span>Unduh Templat Excel</span>
            </button>
          </div>

          {/* File Drag and Drop / Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Pilih / Drop File Excel Atau CSV
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-[#094E96] rounded-2xl p-6 text-center transition bg-slate-50 hover:bg-blue-50/30 cursor-pointer relative">
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-[#094E96]" />
                <span className="text-xs font-semibold text-slate-700">
                  {file ? file.name : "Klik di sini atau seret file Excel/CSV ke dalam area ini"}
                </span>
                <span className="text-[11px] text-slate-400">
                  Mendukung format .XLSX, .XLS, dan .CSV (Maksimal 10MB)
                </span>
              </div>
            </div>
          </div>

          {/* Error / Success Messages */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2 font-bold">
              <Check className="w-4 h-4 text-green-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Data Preview Table */}
          {parsedData.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Table className="w-4 h-4 text-[#094E96]" />
                  Pratinjau Data yang Terbaca ({parsedData.length} Responden):
                </span>
                <span className="text-[11px] text-slate-500">
                  Pastikan Nama & NIM sudah benar sebelum dikirim
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 sticky top-0 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">No</th>
                      <th className="py-2 px-3">NIM</th>
                      <th className="py-2 px-3">Nama Alumni</th>
                      <th className="py-2 px-3">Tahun Lulus</th>
                      <th className="py-2 px-3">Email</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {parsedData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono text-[11px]">{idx + 1}</td>
                        <td className="py-2 px-3 font-mono font-semibold text-slate-900">{row.nim}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{row.nama}</td>
                        <td className="py-2 px-3 font-mono">{row.tahun_lulus}</td>
                        <td className="py-2 px-3 text-slate-500">{row.email || "-"}</td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-800">
                            Ready
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button onClick={onClose} className="btn-ghost text-xs py-2 px-4">
            Batal
          </button>

          <button
            disabled={parsedData.length === 0 || isLoading}
            onClick={handleImportSubmit}
            className="btn-primary text-xs py-2.5 px-5 bg-[#094E96] hover:bg-[#0A3B75] disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Mengimpor Ke Database...</span>
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                <span>Simpan {parsedData.length > 0 ? `${parsedData.length} Data` : ""} Ke Database</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

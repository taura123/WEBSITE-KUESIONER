import React from "react";
import { Download, FileSpreadsheet, FileText, CheckCircle2 } from "lucide-react";
import { exportToKemendiktiExcel, exportToKemendiktiCSV } from "../../utils/exportKemendikti";

export default function KemendiktiExportHub({ respondents = [] }) {
  const handleExportExcel = () => {
    exportToKemendiktiExcel(respondents);
  };

  const handleExportCSV = () => {
    exportToKemendiktiCSV(respondents);
  };

  return (
    <div className="card border border-emerald-100 overflow-hidden">
      {/* Clean Header */}
      <div className="bg-emerald-50/50 p-5 border-b border-emerald-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
              Format Baku Kemendiktisaintek
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {respondents.length} Data Responden
            </span>
          </div>
          <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <span>Pusat Unduh Data & Ekspor Kemendikti</span>
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-200 rounded-lg shadow-sm shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-semibold text-emerald-700">86 Kolom Terpetakan Otomatis</span>
        </div>
      </div>

      {/* Action Cards (Only 2 as requested) */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
        
        {/* Card 1: Excel (.xlsx) */}
        <div className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold font-mono">
                .XLSX Excel
              </span>
              <FileSpreadsheet className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition" />
            </div>
            <h4 className="font-bold text-[#0F172A] mb-1">Excel Standar Kemendikti</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Format workbook Excel resmi untuk tinjauan sebelum upload.
            </p>
          </div>
          <button
            onClick={handleExportExcel}
            disabled={respondents.length === 0}
            className="mt-4 w-full py-2.5 px-4 rounded-lg bg-[#0F2042] hover:bg-[#1B3A7A] text-white text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Excel (.xlsx)</span>
          </button>
        </div>

        {/* Card 2: CSV (.csv) */}
        <div className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-bold font-mono">
                .CSV Upload Ready
              </span>
              <FileText className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition" />
            </div>
            <h4 className="font-bold text-[#0F172A] mb-1">CSV Siap Upload Portal</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Format CSV murni (Comma delimited) untuk diunggah ke portal tracerstudy.kemdikbud.go.id.
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            disabled={respondents.length === 0}
            className="mt-4 w-full py-2.5 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Portal</span>
          </button>
        </div>

      </div>
    </div>
  );
}

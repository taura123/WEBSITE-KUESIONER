import React, { useState, useMemo } from "react";
import { TAU_PRODI_LIST } from "../../data/tauProdi";
import { formatRupiah } from "../../utils/formatters";
import { Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight, User, UserPlus } from "lucide-react";

export default function RespondentsTable({
  respondents = [],
  onViewDetail,
  onEdit,
  onAdd,
  onDelete
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingRespondent, setDeletingRespondent] = useState(null);
  const pageSize = 10;

  const STATUS_LIST = [
    { value: "1", label: "Bekerja" },
    { value: "3", label: "Wirausaha" },
    { value: "4", label: "Lanjut Studi" },
    { value: "2", label: "Belum Bekerja" },
    { value: "5", label: "Mencari Kerja" },
  ];

  const filteredData = useMemo(() => {
    return respondents.filter((item) => {
      const matchSearch =
        !searchTerm ||
        item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nim?.includes(searchTerm) ||
        item.f5b?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchProdi = !selectedProdi || item.kdpst === selectedProdi;
      const matchYear = !selectedYear || String(item.tahun_lulus) === selectedYear;
      const matchStatus = !selectedStatus || String(item.f8) === selectedStatus;

      return matchSearch && matchProdi && matchYear && matchStatus;
    });
  }, [respondents, searchTerm, selectedProdi, selectedYear, selectedStatus]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const graduationYears = Array.from(
    new Set(respondents.map((r) => r.tahun_lulus).filter(Boolean))
  ).sort().reverse();

  const getProdiName = (kode) => {
    const p = TAU_PRODI_LIST.find((i) => i.kode === kode);
    return p ? p.nama.split(" / ")[0] : kode || "-";
  };

  const getStatusBadge = (status) => {
    switch (String(status)) {
      case "1":
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold badge-bekerja">Bekerja</span>;
      case "3":
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold badge-wiraswasta">Wirausaha</span>;
      case "4":
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold badge-studi">Studi Lanjut</span>;
      case "2":
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold badge-belum">Belum Bekerja</span>;
      case "5":
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold badge-cari">Mencari Kerja</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-xs text-slate-500 bg-slate-100">-</span>;
    }
  };

  return (
    <div className="card overflow-hidden">
      {/* Top Controls */}
      <div className="p-6 border-b border-slate-200 bg-white space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <User className="w-5 h-5 text-[#0F2042]" />
              <span>Daftar Responden Alumni (CRUD)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Menampilkan {filteredData.length} dari total {respondents.length} responden tersimpan.
            </p>
          </div>

          {/* Action Buttons: Add Respondent & Search */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-add-respondent"
              onClick={onAdd}
              className="btn-primary text-xs py-2 px-3.5 bg-[#0F2042] hover:bg-[#1B3A7A]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Tambah Responden</span>
            </button>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                id="search-respondent-input"
                type="text"
                placeholder="Cari Nama, NIM, Perusahaan..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="form-input pl-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <select
              id="filter-prodi"
              value={selectedProdi}
              onChange={(e) => {
                setSelectedProdi(e.target.value);
                setCurrentPage(1);
              }}
              className="form-input text-xs"
            >
              <option value="">Semua Program Studi</option>
              {TAU_PRODI_LIST.map((p) => (
                <option key={p.kode} value={p.kode}>{p.nama}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              id="filter-tahun"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setCurrentPage(1);
              }}
              className="form-input text-xs"
            >
              <option value="">Semua Tahun Lulus</option>
              {graduationYears.map((y) => (
                <option key={y} value={y}>Tahun {y}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              id="filter-status"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="form-input text-xs"
            >
              <option value="">Semua Status</option>
              {STATUS_LIST.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-5 py-3.5">No</th>
              <th className="px-5 py-3.5">NIM & Nama Mahasiswa</th>
              <th className="px-5 py-3.5">Program Studi</th>
              <th className="px-5 py-3.5">Lulus</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Instansi / Karir</th>
              <th className="px-5 py-3.5">Pendapatan</th>
              <th className="px-5 py-3.5 text-center">Aksi (CRUD)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 font-mono text-slate-400">
                    {(currentPage - 1) * pageSize + idx + 1}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-[#0F172A] text-sm">{item.nama}</div>
                    <div className="font-mono text-slate-400 text-xs">{item.nim}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-700 font-medium">
                    {getProdiName(item.kdpst)}
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-500">
                    {item.tahun_lulus}
                  </td>
                  <td className="px-5 py-4">
                    {getStatusBadge(item.f8)}
                  </td>
                  <td className="px-5 py-4 text-slate-700">
                    {item.f5b || item.f5c || (item.f8 === "4" ? (item.f18b || "-") : "-")}
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-green-700">
                    {item.f505 ? formatRupiah(item.f505) : "-"}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* View */}
                      <button
                        id={`btn-view-${item.id || idx}`}
                        onClick={() => onViewDetail(item)}
                        className="p-1.5 rounded-lg bg-blue-50 text-[#094E96] hover:bg-[#094E96] hover:text-white transition"
                        title="Lihat Detail Responden"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit (Update) */}
                      <button
                        id={`btn-edit-${item.id || idx}`}
                        onClick={() => onEdit(item)}
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-700 hover:text-white transition"
                        title="Edit Data Responden"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setDeletingRespondent(item)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
                        title="Hapus Data Responden"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-slate-400 text-xs">
                  {respondents.length === 0
                    ? "Belum ada data responden. Silakan isi kuesioner atau klik '+ Tambah Responden'."
                    : "Tidak ditemukan responden yang sesuai filter."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
        <div>
          Halaman {currentPage} dari {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deletingRespondent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Konfirmasi Hapus</h3>
              <p className="text-sm text-slate-600 mb-6">
                Apakah Anda yakin ingin menghapus data responden <strong>{deletingRespondent.nama}</strong> ({deletingRespondent.nim})? Data yang dihapus tidak dapat dikembalikan.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeletingRespondent(null)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    onDelete(deletingRespondent.id || deletingRespondent.nim);
                    setDeletingRespondent(null);
                  }}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition shadow-sm"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

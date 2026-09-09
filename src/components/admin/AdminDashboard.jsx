import React, { useState, useEffect } from "react";
import AnalyticsCharts from "./AnalyticsCharts";
import KemendiktiExportHub from "./KemendiktiExportHub";
import RespondentsTable from "./RespondentsTable";
import RespondentDetailModal from "./RespondentDetailModal";
import RespondentFormModal from "./RespondentFormModal";
import TargetGraduatesModal from "./TargetGraduatesModal";
import ReminderModal from "./ReminderModal";
import {
  deleteResponse,
  saveResponse,
  updateResponse,
  getTargetGraduates,
  setTargetGraduates
} from "../../utils/storage";
import {
  GraduationCap,
  Search,
  TrendingUp,
  Briefcase,
  MessageSquare,
  Edit2,
  UserPlus
} from "lucide-react";

export default function AdminDashboard({ respondents = [], onDataUpdated, onLogout }) {
  const [selectedYear, setSelectedYear] = useState("Semua");
  const [selectedRespondent, setSelectedRespondent] = useState(null);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRespondent, setEditingRespondent] = useState(null);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [targetGraduates, setTargetGraduatesState] = useState(100);

  useEffect(() => {
    setTargetGraduatesState(getTargetGraduates());
  }, []);

  // Filter respondents by survey cohort
  const filteredRespondents =
    selectedYear === "Semua"
      ? respondents
      : respondents.filter((r) => {
          if (selectedYear === "2026") return String(r.tahun_lulus) === "2026";
          if (selectedYear === "2025") return ["2024", "2025"].includes(String(r.tahun_lulus));
          if (selectedYear === "2024") return ["2023", "2024"].includes(String(r.tahun_lulus));
          if (selectedYear === "2023") return ["2022", "2023"].includes(String(r.tahun_lulus));
          return String(r.tahun_lulus) === selectedYear;
        });

  // KPI Calculations on real data
  const trackedCount = filteredRespondents.length;
  const currentTarget = Math.max(1, targetGraduates);
  const responseRate = ((trackedCount / currentTarget) * 100).toFixed(2);

  const workingOrBizCount = filteredRespondents.filter((r) =>
    ["1", "3"].includes(String(r.f8))
  ).length;

  // CRUD Handlers
  const handleAddRespondent = () => {
    setEditingRespondent(null);
    setIsFormModalOpen(true);
  };

  const handleEditRespondent = (item) => {
    setEditingRespondent(item);
    setIsFormModalOpen(true);
  };

  const handleSaveRespondentForm = (data) => {
    const targetId = editingRespondent?.id || editingRespondent?.nim;
    if (targetId) {
      const updated = updateResponse(targetId, data);
      if (onDataUpdated) onDataUpdated(updated);
    } else {
      saveResponse(data);
      const fresh = getStoredResponsesSafe();
      if (onDataUpdated) onDataUpdated(fresh);
    }
  };

  const getStoredResponsesSafe = () => {
    try {
      const raw = localStorage.getItem("tau_tracer_responses_real_v3");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  };

  const handleDelete = (id) => {
    const updated = deleteResponse(id);
    if (onDataUpdated) onDataUpdated(updated);
  };

  const handleSaveTarget = (num) => {
    const saved = setTargetGraduates(num);
    setTargetGraduatesState(saved);
  };

  return (
    <div className="space-y-6">
      {/* ── 1. Top Deep Blue Hero Banner ── */}
      <div className="rounded-2xl bg-gradient-to-r from-[#094E96] to-[#0A3B75] p-6 md:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-sm">
            <img src="/logo-tau-icon.png" alt="TAU Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              TRACER STUDY {selectedYear === "Semua" ? "TAU" : selectedYear}
            </h1>
            <h2 className="text-base font-bold text-blue-100">
              Tanri Abeng University
            </h2>
            <p className="text-xs text-blue-200 mt-0.5">
              Biro Kemahasiswaan, Karir & Hubungan Alumni (BKHA)
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 border border-white/20 text-white backdrop-blur-xs">
              Tahun Survei: {selectedYear}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 border border-white/20 text-white backdrop-blur-xs">
              Target: {targetGraduates} Lulusan
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={handleAddRespondent}
              className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Responden</span>
            </button>
            <button
              onClick={() => setIsReminderOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Reminder Alumni (WA & Email)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Tahun Tracer Study Selector Pills ── */}
      <div className="card p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-2">
            Tahun Tracer Study:
          </span>
          {["Semua", "TS2026", "TS2025", "TS2024", "TS2023"].map((label) => {
            const yearVal = label.replace("TS", "");
            const isActive = selectedYear === yearVal;
            return (
              <button
                key={label}
                onClick={() => setSelectedYear(yearVal)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#094E96] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setIsTargetModalOpen(true)}
          className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5 text-slate-600 hover:text-[#094E96]"
        >
          <Edit2 className="w-3.5 h-3.5 text-sky-600" />
          <span>Edit Target Lulusan ({targetGraduates})</span>
        </button>
      </div>

      {/* ── 3. Top 4 KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Jumlah Target Lulusan (Editable) */}
        <div className="card p-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-[#094E96] shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl lg:text-3xl font-black text-[#0F172A]">
                {targetGraduates.toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Jumlah Target Lulusan</p>
            </div>
          </div>
          <button
            onClick={() => setIsTargetModalOpen(true)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-[#094E96] transition shrink-0"
            title="Ubah Target Lulusan"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Alumni Terlacak */}
        <div className="card p-5 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-sky-50 text-sky-600 shrink-0">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-black text-[#0F172A]">
              {trackedCount.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Alumni Terlacak</p>
          </div>
        </div>

        {/* Card 3: Response Rate */}
        <div className="card p-5 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-black text-[#0F172A]">
              {responseRate}%
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Response Rate (dari {targetGraduates})
            </p>
          </div>
        </div>

        {/* Card 4: Bekerja / Wirausaha */}
        <div className="card p-5 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-green-50 text-green-700 shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl lg:text-3xl font-black text-[#0F172A]">
              {workingOrBizCount.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Bekerja / Wirausaha</p>
          </div>
        </div>
      </div>

      {/* ── 4. Infografis Section ── */}
      <AnalyticsCharts
        respondents={filteredRespondents}
        currentYear={selectedYear === "Semua" ? "2025" : selectedYear}
      />

      {/* ── 5. Kemendikti Export Hub ── */}
      <KemendiktiExportHub respondents={filteredRespondents} />

      {/* ── 6. Respondents Management Table with Full CRUD ── */}
      <RespondentsTable
        respondents={filteredRespondents}
        onViewDetail={(item) => setSelectedRespondent(item)}
        onEdit={handleEditRespondent}
        onAdd={handleAddRespondent}
        onDelete={handleDelete}
      />

      {/* Detail Modal */}
      {selectedRespondent && (
        <RespondentDetailModal
          respondent={selectedRespondent}
          onClose={() => setSelectedRespondent(null)}
        />
      )}

      {/* CRUD Form Modal (Create / Edit) */}
      <RespondentFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingRespondent(null);
        }}
        onSave={handleSaveRespondentForm}
        editData={editingRespondent}
      />

      {/* Editable Target Modal */}
      <TargetGraduatesModal
        isOpen={isTargetModalOpen}
        onClose={() => setIsTargetModalOpen(false)}
        currentTarget={targetGraduates}
        onSave={handleSaveTarget}
      />

      {/* Reminder Modal */}
      <ReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
      />
    </div>
  );
}

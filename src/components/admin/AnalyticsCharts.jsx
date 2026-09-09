import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function AnalyticsCharts({ respondents = [], currentYear = "2025" }) {
  const total = respondents.length;

  // Counts
  const counts = { "1": 0, "3": 0, "5": 0, "4": 0, "2": 0 };
  respondents.forEach((r) => {
    const s = String(r.f8);
    if (counts[s] !== undefined) counts[s]++;
  });

  const workingBizCount = counts["1"] + counts["3"];
  const workingBizPct = total > 0 ? ((workingBizCount / total) * 100).toFixed(1) : "0";

  // Waiting time <= 6 months among working/biz
  const workingBizList = respondents.filter((r) => ["1", "3"].includes(String(r.f8)));
  const waitUnder6 = workingBizList.filter((r) => {
    const m = parseInt(r.f502, 10);
    return !isNaN(m) && m <= 6;
  }).length;
  const waitUnder6Pct = workingBizList.length > 0 ? ((waitUnder6 / workingBizList.length) * 100).toFixed(1) : "0";

  // Doughnut Data (Matching reference color palette: Navy, Sky, Orange, Green, Red)
  const doughnutData = {
    labels: ["Bekerja", "Wirausaha", "Sedang Mencari", "Melanjutkan", "Belum Bekerja"],
    datasets: [
      {
        data: [counts["1"], counts["3"], counts["5"], counts["4"], counts["2"]],
        backgroundColor: ["#094E96", "#0284C7", "#F59E0B", "#16A34A", "#DC2626"],
        borderColor: "#FFFFFF",
        borderWidth: 2,
        cutout: "72%",
      },
    ],
  };

  // Waiting time Bar Chart categories: < 6 Bulan, 6 - 18 Bulan, > 18 Bulan
  let waitCat1_bekerja = 0, waitCat2_bekerja = 0, waitCat3_bekerja = 0;
  let waitCat1_wira = 0, waitCat2_wira = 0, waitCat3_wira = 0;

  respondents.forEach((r) => {
    const m = parseInt(r.f502, 10);
    if (isNaN(m)) return;
    if (r.f8 === "1") {
      if (m <= 6) waitCat1_bekerja++;
      else if (m <= 18) waitCat2_bekerja++;
      else waitCat3_bekerja++;
    } else if (r.f8 === "3") {
      if (m <= 6) waitCat1_wira++;
      else if (m <= 18) waitCat2_wira++;
      else waitCat3_wira++;
    }
  });

  const waitBarData = {
    labels: ["< 6 Bulan", "6 - 18 Bulan", "> 18 Bulan"],
    datasets: [
      {
        label: "Bekerja",
        data: [waitCat1_bekerja, waitCat2_bekerja, waitCat3_bekerja],
        backgroundColor: "#094E96",
        borderRadius: 4,
      },
      {
        label: "Wirausaha",
        data: [waitCat1_wira, waitCat2_wira, waitCat3_wira],
        backgroundColor: "#0284C7",
        borderRadius: 4,
      },
    ],
  };

  // Income > 1.2x UMP threshold (e.g., > IDR 6,000,000)
  const UMP_THRESHOLD = 6000000;
  const bekerjaAboveUmp = respondents.filter((r) => r.f8 === "1" && parseInt(r.f505, 10) >= UMP_THRESHOLD).length;
  const bekerjaTotal = counts["1"];
  const bekerjaAbovePct = bekerjaTotal > 0 ? ((bekerjaAboveUmp / bekerjaTotal) * 100).toFixed(1) : "0";

  const wiraAboveUmp = respondents.filter((r) => r.f8 === "3" && parseInt(r.f505, 10) >= UMP_THRESHOLD).length;
  const wiraTotal = counts["3"];
  const wiraAbovePct = wiraTotal > 0 ? ((wiraAboveUmp / wiraTotal) * 100).toFixed(1) : "0";

  const statusRows = [
    { label: "Bekerja Full Time / Part Time", count: counts["1"], color: "#094E96" },
    { label: "Wirausaha / Freelancer", count: counts["3"], color: "#0284C7" },
    { label: "Sedang Mencari Kerja", count: counts["5"], color: "#F59E0B" },
    { label: "Melanjutkan Pendidikan", count: counts["4"], color: "#16A34A" },
    { label: "Belum Memungkinkan Bekerja", count: counts["2"], color: "#DC2626" },
  ];

  return (
    <div className="space-y-6">
      {/* 2 Wide Highlight Cards (Referencing Screenshot 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Highlight Card 1: Bekerja/Wirausaha */}
        <div className="p-6 md:p-8 rounded-2xl bg-[#094E96] text-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-4xl md:text-5xl font-black tracking-tight mb-2">
              {workingBizPct}%
            </div>
            <h3 className="text-base md:text-lg font-bold">
              Alumni bekerja atau berwirausaha
            </h3>
            <p className="text-xs text-blue-100 mt-1">
              dari total {total} responden yang mengisi kuesioner TS{currentYear}
            </p>
          </div>
        </div>

        {/* Highlight Card 2: Masa Tunggu <= 6 Bulan */}
        <div className="p-6 md:p-8 rounded-2xl bg-[#0F2042] text-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-4xl md:text-5xl font-black tracking-tight text-sky-400 mb-2">
              {waitUnder6Pct}%
            </div>
            <h3 className="text-base md:text-lg font-bold">
              Memperoleh pekerjaan ≤ 6 bulan
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              setelah lulus (kategori bekerja & wirausaha)
            </p>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div>
        <h2 className="text-xl font-bold text-[#0F172A]">Infografis Tracer Study</h2>
      </div>

      {/* 4 Infografis Grid (Referencing Screenshot 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Status Alumni Donut */}
        <div className="card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-[#0F172A]">Status Alumni Saat Ini</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                {total} responden
              </span>
            </div>

            {/* Legends Row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mb-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#094E96]" />Bekerja</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />Wirausaha</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />Sedang Mencari</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />Melanjutkan</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />Belum</span>
            </div>
          </div>

          <div className="h-64 relative flex items-center justify-center">
            {total > 0 ? (
              <>
                <Doughnut
                  data={doughnutData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-[#0F172A]">{total}</span>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider">TOTAL RESPONDEN</span>
                </div>
              </>
            ) : (
              <div className="text-xs text-slate-400">Belum ada data responden kuesioner</div>
            )}
          </div>
        </div>

        {/* Card 2: Rincian Status with Progress Bars */}
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-sm text-[#0F172A]">Rincian Status</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 font-semibold border border-green-200">
              Terverifikasi
            </span>
          </div>

          <div className="space-y-4">
            {statusRows.map((row) => {
              const pct = total > 0 ? ((row.count / total) * 100).toFixed(1) : "0";
              return (
                <div key={row.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 font-medium text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: row.color }} />
                      {row.label}
                    </span>
                    <div className="flex items-center gap-2 font-mono font-semibold text-slate-900">
                      <span>{row.count}</span>
                      <span className="text-slate-400 text-[11px] font-normal">({pct}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%`, backgroundColor: row.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Masa Tunggu Alumni */}
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-[#0F172A]">Masa Tunggu Alumni</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-[#094E96] font-semibold">
              Bekerja & Wirausaha
            </span>
          </div>

          <div className="h-60 relative">
            {workingBizList.length > 0 ? (
              <Bar
                data={waitBarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                      labels: { boxWidth: 12, color: "#475569", font: { size: 11 } },
                    },
                  },
                  scales: {
                    x: { grid: { display: false }, ticks: { color: "#64748B", font: { size: 10 } } },
                    y: { grid: { color: "#F1F5F9" }, ticks: { color: "#64748B", font: { size: 10 } } },
                  },
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Belum ada data masa tunggu kerja
              </div>
            )}
          </div>
        </div>

        {/* Card 4: Penghasilan > 1.2x UMP */}
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">Penghasilan &gt; 1,2x UMP</h3>
              <p className="text-[11px] text-slate-500">Standar indikator IKU Kemendiktisaintek RI</p>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-[#094E96] font-semibold border border-blue-200">
              Indikator IKU
            </span>
          </div>

          <div className="space-y-6 pt-2">
            {/* Bekerja */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0F172A]">Karyawan / Bekerja</span>
                <span className="text-base font-black text-[#094E96]">{bekerjaAbovePct}%</span>
              </div>
              <div className="text-[11px] text-slate-500">
                <strong>{bekerjaAboveUmp}</strong> dari {bekerjaTotal} alumni bekerja
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#094E96] rounded-full transition-all duration-300"
                  style={{ width: `${bekerjaAbovePct}%` }}
                />
              </div>
            </div>

            {/* Wirausaha */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0F172A]">Wirausaha / Enterpreneur</span>
                <span className="text-base font-black text-sky-600">{wiraAbovePct}%</span>
              </div>
              <div className="text-[11px] text-slate-500">
                <strong>{wiraAboveUmp}</strong> dari {wiraTotal} alumni wirausaha
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-600 rounded-full transition-all duration-300"
                  style={{ width: `${wiraAbovePct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

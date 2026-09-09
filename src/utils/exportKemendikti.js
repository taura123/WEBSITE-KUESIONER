import * as XLSX from "xlsx";
import { OFFICIAL_KEMENDIKTI_HEADERS } from "../data/kemendiktiSchema";

// Map each questionnaire response into the exact official Kemendikti Excel column format
export const toKemendiktiRow = (row) => {
  const cleanSalary = row.f505 ? String(row.f505).replace(/\D/g, "") : "";
  const cleanWaitMonths = row.f502 ? String(row.f502).replace(/\D/g, "") : "";

  // 1. F301: Valid values are only '1', '2', or '3'
  let f301Val = "";
  let f302Val = "";
  let f303Val = "";

  if (row.f303 === "1") {
    f301Val = "3"; // Tidak mencari kerja
  } else if (row.f301 && Number(row.f301) > 0) {
    f301Val = "1"; // Sebelum lulus
    f302Val = String(row.f301);
  } else if (row.f302 && Number(row.f302) > 0) {
    f301Val = "2"; // Sesudah lulus
    f303Val = String(row.f302);
  } else if (row.f301 === "1" || row.f301 === "2" || row.f301 === "3") {
    f301Val = row.f301;
    f302Val = row.f302 || "";
    f303Val = row.f303 || "";
  }

  // 2. F14 & F15 Mandatory defaults when F8 = 1 (Bekerja)
  const isBekerja = String(row.f8) === "1";
  const f14Val = row.f14 || (isBekerja ? "2" : ""); // Default '2' (Erat) if missing for F8=1
  const f15Val = row.f15 || (isBekerja ? "2" : ""); // Default '2' (Tingkat yang sama) if missing for F8=1

  return {
    "Kode Pt": row.kdptim || "031054",
    "Kode Prodi": row.kdpst || "",
    "Nomor Mhs": row.nim || "",
    "Nama": row.nama || "",
    "Hp": row.hp || "",
    "Email": row.email || "",
    "Tahun Lulus": row.tahun_lulus || "",
    "NIK": row.nik || "",
    "NPWP": row.npwp || "",
    "f8": row.f8 || "",
    "f502": cleanWaitMonths,
    "f505": cleanSalary,
    "f5a1": row.f5a1 || "",
    "f5a2": row.f5a2 || "",
    "f1101": row.f1101 || "",
    "f1102": row.f1102 || "",
    "f5b": row.f5b || "",
    "f5c": row.f5c || "",
    "f5d": row.f5d || "",
    "f18a": row.f18a || "",
    "f18b": row.f18b || "",
    "f18c": row.f18c || "",
    "f18d": row.f18d || "",
    "f1201": row.f12 || row.f1201 || (String(row.f8) === "4" ? "" : "1"),
    "f1202": row.f1202 || "",
    "f14": f14Val,
    "f15": f15Val,
    "f1761": row.f1301a || row.f1761 || "4",
    "f1762": row.f1301b || row.f1762 || "5",
    "f1763": row.f1302a || row.f1763 || "4",
    "f1764": row.f1302b || row.f1764 || "5",
    "f1765": row.f1303a || row.f1765 || "3",
    "f1766": row.f1303b || row.f1766 || "4",
    "f1767": row.f1304a || row.f1767 || "4",
    "f1768": row.f1304b || row.f1768 || "5",
    "f1769": row.f1305a || row.f1769 || "4",
    "f1770": row.f1305b || row.f1770 || "5",
    "f1771": row.f1306a || row.f1771 || "4",
    "f1772": row.f1306b || row.f1772 || "5",
    "f1773": row.f1307a || row.f1773 || "4",
    "f1774": row.f1307b || row.f1774 || "5",
    "f21": row.f1401 || row.f21 || "3",
    "f22": row.f1402 || row.f22 || "3",
    "f23": row.f1403 || row.f23 || "3",
    "f24": row.f1404 || row.f24 || "3",
    "f25": row.f1405 || row.f25 || "3",
    "f26": row.f26 || "3",
    "f27": row.f27 || "3",
    "f301": f301Val,
    "f302": f302Val,
    "f303": f303Val,
    "f401": row.f401 === "1" ? "1" : "0",
    "f402": row.f402 === "1" ? "1" : "0",
    "f403": row.f403 === "1" ? "1" : "0",
    "f404": row.f404 === "1" ? "1" : "0",
    "f405": row.f405 === "1" ? "1" : "0",
    "f406": row.f406 === "1" ? "1" : "0",
    "f407": row.f407 === "1" ? "1" : "0",
    "f408": row.f408 === "1" ? "1" : "0",
    "f409": row.f409 === "1" ? "1" : "0",
    "f410": row.f410 === "1" ? "1" : "0",
    "f411": row.f411 === "1" ? "1" : "0",
    "f412": row.f412 === "1" ? "1" : "0",
    "f413": row.f413 === "1" ? "1" : "0",
    "f414": row.f414 === "1" ? "1" : "0",
    "f415": row.f415 === "1" ? "1" : "0",
    "f416": row.f416 || "",
    "f6": row.f6 || "",
    "f7": row.f7 || "",
    "f7a": row.f7a || "",
    "f1001": row.f1001 || "1",
    "f1002": row.f1002 || "",
    "f1601": row.f1601 === "1" ? "1" : "0",
    "f1602": row.f1602 === "1" ? "1" : "0",
    "f1603": row.f1603 === "1" ? "1" : "0",
    "f1604": row.f1604 === "1" ? "1" : "0",
    "f1605": row.f1605 === "1" ? "1" : "0",
    "f1606": row.f1606 === "1" ? "1" : "0",
    "f1607": row.f1607 === "1" ? "1" : "0",
    "f1608": row.f1608 === "1" ? "1" : "0",
    "f1609": row.f1609 === "1" ? "1" : "0",
    "f1610": row.f1610 === "1" ? "1" : "0",
    "f1611": row.f1611 === "1" ? "1" : "0",
    "f1612": row.f1612 === "1" ? "1" : "0",
    "f1613": row.f1613 === "1" ? "1" : "0",
    "f1614": row.f1614 || ""
  };
};

// ─── Export: Excel (.xlsx) Resmi Kemendikti ─────────────────────────────────
export const exportToKemendiktiExcel = (dataList, filename = "TAU_TracerStudy_Kemendikti.xlsx") => {
  const rows = dataList.map(toKemendiktiRow);

  const ws = XLSX.utils.json_to_sheet(rows, { header: OFFICIAL_KEMENDIKTI_HEADERS });

  // Force all cells to text format (prevent NIK/NIM from losing leading zeros)
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
  for (let R = range.s.r; R <= range.e.r; R++) {
    for (let C = range.s.c; C <= range.e.c; C++) {
      const addr = XLSX.utils.encode_cell({ r: R, c: C });
      if (ws[addr]) {
        ws[addr].t = "s";
      }
    }
  }

  // Column width formatting
  ws["!cols"] = OFFICIAL_KEMENDIKTI_HEADERS.map((h) =>
    ["Nama", "f5b", "f18b", "f18c"].includes(h)
      ? { wch: 30 }
      : ["Email"].includes(h)
        ? { wch: 28 }
        : ["NIK", "Nomor Mhs", "NPWP"].includes(h)
          ? { wch: 18 }
          : { wch: 12 }
  );

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  XLSX.writeFile(wb, filename);
};

// ─── Export: CSV Portal Kemendikti ──────────────────────────────────────────
export const exportToKemendiktiCSV = (dataList, filename = "TAU_TracerStudy_Kemendikti.csv") => {
  const rows = dataList.map(toKemendiktiRow);
  const headerLine = OFFICIAL_KEMENDIKTI_HEADERS.join(",");
  const dataLines = rows.map((row) =>
    OFFICIAL_KEMENDIKTI_HEADERS.map((col) => {
      let cell = row[col] || "";
      if (cell.includes(",") || cell.includes('"') || cell.includes("\n")) {
        cell = `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(",")
  );
  const csv = "\uFEFF" + [headerLine, ...dataLines].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ─── Export: Dataset Riset Numerik ──────────────────────────────────────────
export const exportMLDataset = (dataList, filename = "TAU_TracerStudy_Dataset_Riset.xlsx") => {
  const rows = dataList.map((r) => ({
    nim: r.nim,
    kdpst: r.kdpst,
    tahun_lulus: parseInt(r.tahun_lulus || 0, 10),
    status_pekerjaan: parseInt(r.f8 || 0, 10),
    masa_tunggu_bulan: r.f502 ? parseInt(r.f502, 10) : 0,
    pendapatan_bulanan: r.f505 ? parseInt(r.f505, 10) : 0,
    jenis_instansi: r.f1101 ? parseInt(r.f1101, 10) : 0,
    skala_perusahaan: r.f5d ? parseInt(r.f5d, 10) : 0,
    keselarasan_studi: r.f11 ? parseInt(r.f11, 10) : 0,
    kesesuaian_pendidikan: r.f12 ? parseInt(r.f12, 10) : 0,
    etika_lulus: parseInt(r.f1301a || 0, 10),
    etika_kerja: parseInt(r.f1301b || 0, 10),
    keahlian_ilmu_lulus: parseInt(r.f1302a || 0, 10),
    keahlian_ilmu_kerja: parseInt(r.f1302b || 0, 10),
    bahasa_inggris_lulus: parseInt(r.f1303a || 0, 10),
    bahasa_inggris_kerja: parseInt(r.f1303b || 0, 10),
    teknologi_lulus: parseInt(r.f1304a || 0, 10),
    teknologi_kerja: parseInt(r.f1304b || 0, 10),
    komunikasi_lulus: parseInt(r.f1305a || 0, 10),
    komunikasi_kerja: parseInt(r.f1305b || 0, 10),
    teamwork_lulus: parseInt(r.f1306a || 0, 10),
    teamwork_kerja: parseInt(r.f1306b || 0, 10),
    pengembangan_diri_lulus: parseInt(r.f1307a || 0, 10),
    pengembangan_diri_kerja: parseInt(r.f1307b || 0, 10),
    kuliah_reguler: parseInt(r.f1401 || 0, 10),
    praktikum: parseInt(r.f1402 || 0, 10),
    magang_mbkm: parseInt(r.f1403 || 0, 10),
    diskusi_kelompok: parseInt(r.f1404 || 0, 10),
    proyek_lapangan: parseInt(r.f1405 || 0, 10),
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Dataset Riset");
  XLSX.writeFile(wb, filename);
};

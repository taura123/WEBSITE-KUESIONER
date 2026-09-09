export const formatRupiah = (number) => {
  if (!number && number !== 0) return "-";
  const num = typeof number === "string" ? parseInt(number.replace(/\D/g, ""), 10) : number;
  if (isNaN(num)) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

export const parseNumberOnly = (str) => {
  if (!str) return "";
  return String(str).replace(/\D/g, "");
};

export const formatNumberWithDots = (val) => {
  if (!val && val !== 0) return "";
  const numStr = String(val).replace(/\D/g, "");
  if (!numStr) return "";
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const getF8Label = (code) => {
  switch (String(code)) {
    case "1": return "Bekerja";
    case "3": return "Wiraswasta";
    case "4": return "Lanjut Studi";
    case "2": return "Belum Memungkinkan Bekerja";
    case "5": return "Mencari Kerja";
    default: return "-";
  }
};

export const getF8BadgeColor = (code) => {
  switch (String(code)) {
    case "1": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    case "3": return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    case "4": return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    case "2": return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    case "5": return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    default: return "bg-slate-500/10 text-slate-400 border-slate-500/30";
  }
};

export const getF11Label = (codeOrRespondent) => {
  let code = codeOrRespondent;
  if (typeof codeOrRespondent === "object" && codeOrRespondent !== null) {
    code = codeOrRespondent.f14 || codeOrRespondent.f11;
  }
  switch (String(code)) {
    case "1": return "Sangat Erat";
    case "2": return "Erat";
    case "3": return "Cukup Erat";
    case "4": return "Kurang Erat";
    case "5": return "Tidak Sama Sekali";
    default: return "-";
  }
};

export const TAU_PRODI_LIST = [
  { kode: "55201", nama: "Teknik Informatika (S1)", fakultas: "School of Engineering & Technology" },
  { kode: "57201", nama: "Sistem Informasi (S1)", fakultas: "School of Engineering & Technology" },
  { kode: "25201", nama: "Teknik Perminyakan (S1)", fakultas: "School of Engineering & Technology" },
  { kode: "20201", nama: "Teknik Elektro (S1)", fakultas: "School of Engineering & Technology" },
  { kode: "22201", nama: "Teknik Sipil (S1)", fakultas: "School of Engineering & Technology" },
  { kode: "23201", nama: "Arsitektur (S1)", fakultas: "School of Engineering & Technology" },
  { kode: "61201", nama: "Manajemen (S1)", fakultas: "School of Management & Leadership" },
  { kode: "62201", nama: "Akuntansi (S1)", fakultas: "School of Management & Leadership" },
  { kode: "70201", nama: "Ilmu Komunikasi (S1)", fakultas: "School of Management & Leadership" },
  { kode: "63201", nama: "Administrasi Bisnis (S1)", fakultas: "School of Management & Leadership" }
];

export const KODE_PT_TAU = "031054";
export const NAMA_PT_TAU = "Tanri Abeng University";

export const TAU_PRODI_MAP = TAU_PRODI_LIST.reduce((acc, curr) => {
  acc[curr.kode] = curr.nama;
  return acc;
}, {});

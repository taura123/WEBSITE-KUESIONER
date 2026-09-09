import React from "react";
import { MapPin, Mail, Phone, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-10 sm:mt-16 bg-[#0F2042] text-slate-200 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white p-1 rounded-lg">
                <img src="/logo-tau-icon.png" alt="TAU" className="h-7 w-7 sm:h-8 sm:w-8 object-contain" />
              </div>
              <span className="font-extrabold text-white text-sm sm:text-base tracking-wide">
                TANRI ABENG UNIVERSITY
              </span>
            </div>
            <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed">
              Biro Kemahasiswaan, Karir & Hubungan Alumni (BKHA)
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-white mb-2.5 sm:mb-3">Kontak Biro Alumni</h3>
            <ul className="space-y-2 text-slate-300 text-[11px] sm:text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 shrink-0 text-sky-400" />
                <span>Jl. Swadarma Raya No. 58, Ulujami, Pesanggrahan, Jakarta Selatan 12250</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-sky-400" />
                <span>alumni@tau.ac.id</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-sky-400" />
                <span>+62 21 5890 8888 (Hunting)</span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-white mb-2.5 sm:mb-3">Tautan Terkait</h3>
            <a
              href="https://tracerstudy.kemdiktisaintek.go.id/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sky-300 hover:text-white text-[11px] sm:text-xs transition font-semibold"
            >
              <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Portal Tracer Study Kemendikbud</span>
            </a>
            <p className="text-slate-400 text-[11px] sm:text-xs mt-2 leading-relaxed">
              Data alumni digunakan resmi untuk pelaporan IKU-1 Perguruan Tinggi sesuai regulasi Kemendiktisaintek.
            </p>
          </div>

        </div>

        <div className="border-t border-slate-700/80 pt-4 sm:pt-6 mt-6 sm:mt-8 flex flex-col gap-1.5 sm:flex-row sm:justify-between items-center text-slate-400 text-[10px] sm:text-xs">
          <span>© {new Date().getFullYear()} Tanri Abeng University. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
}

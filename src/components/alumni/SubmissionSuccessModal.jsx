import React from "react";
import { CheckCircle, Home, RefreshCw } from "lucide-react";

export default function SubmissionSuccessModal({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center p-3 sm:p-4 py-10 sm:py-16 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center border border-slate-200">
        
        {/* Animated Check Icon */}
        <div className="flex justify-center mb-5 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-50 rounded-full flex items-center justify-center border-4 border-green-100">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
          </div>
        </div>

        {/* Success Message */}
        <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] mb-1.5 sm:mb-2">Terima Kasih!</h2>
        <h3 className="text-xs sm:text-sm font-bold text-sky-600 mb-3 sm:mb-4">Pengisian Kuesioner Telah Berhasil</h3>
        
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 sm:mb-8">
          Terima kasih banyak atas partisipasi dan waktu Anda dalam mengisi Kuesioner Tracer Study Tanri Abeng University. Kontribusi Anda sangat berarti bagi pengembangan kampus dan pelaporan IKU Kemendiktisaintek.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 sm:gap-3">
          <button
            onClick={() => {
              if (onReset) onReset();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="w-full btn-primary py-2.5 sm:py-3 bg-[#0F2042] hover:bg-[#1B3A7A] flex justify-center items-center gap-2 text-xs sm:text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Isi Kuesioner Untuk Responden Lain</span>
          </button>
          
          <button
            onClick={() => window.location.href = "https://tau.ac.id"}
            className="w-full btn-ghost py-2.5 sm:py-3 flex justify-center items-center gap-2 text-slate-500 hover:text-[#0F2042] text-xs sm:text-sm"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Halaman Utama TAU</span>
          </button>
        </div>
        
      </div>
    </div>
  );
}

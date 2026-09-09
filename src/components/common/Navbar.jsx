import React from "react";
import { UserCheck, LogOut } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, isAdmin = false, adminUser = null, onLogout }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-18 py-2 sm:py-3">

          {/* Logo */}
          <div className="flex items-center cursor-pointer shrink-0" onClick={() => setActiveTab("alumni")}>
            <img
              src="/logo-tau.png"
              alt="Tanri Abeng University"
              className="h-9 sm:h-11 w-auto object-contain"
            />
          </div>

          {/* Center Title (Desktop) */}
          <div className="hidden md:block text-center">
            <h1 className="text-sm font-bold text-[#1B3A7A]">Tanri Abeng University</h1>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {isAdmin && adminUser && (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-semibold mr-1">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span className="truncate max-w-[170px]" title={adminUser.email}>
                  {adminUser.email}
                </span>
              </div>
            )}

            <button
              id="nav-tab-alumni"
              onClick={() => setActiveTab("alumni")}
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-sm font-semibold transition-all ${activeTab === "alumni" && !isAdmin
                ? "bg-[#1B3A7A] text-white shadow-xs"
                : "text-slate-600 hover:text-[#1B3A7A] hover:bg-slate-100"
                }`}
            >
              <span className="hidden sm:inline">Isi Kuesioner</span>
              <span className="sm:hidden">Kuesioner</span>
            </button>

            <button
              id="nav-tab-admin"
              onClick={() => setActiveTab("admin")}
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${activeTab === "admin"
                ? "bg-[#1B3A7A] text-white shadow-xs"
                : "text-slate-600 hover:text-[#1B3A7A] hover:bg-slate-100"
                }`}
            >
              <span className="hidden sm:inline">Dashboard Admin</span>
              <span className="sm:hidden">Admin</span>
            </button>

            {isAdmin && onLogout && (
              <button
                onClick={onLogout}
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-sm font-bold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center gap-1 sm:gap-1.5 border border-red-200 shadow-xs ml-0.5 sm:ml-2"
                title="Keluar dari Akses Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

import React, { useState, useEffect } from "react";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import TracerFormWizard from "./components/alumni/TracerFormWizard";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminLoginPage from "./components/admin/AdminLoginPage";
import { getStoredResponses } from "./utils/storage";

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem("tau_active_tab") || "alumni";
  });
  const [respondents, setRespondents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem("tau_admin_auth") === "true";
  });

  // Always keep fresh data from Supabase cloud (authoritative source)
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const data = await getStoredResponses();
      if (Array.isArray(data)) {
        setRespondents(data);
      }
    } catch (e) {
      console.error("Error refreshing data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  const handleSubmittedSuccess = () => {
    refreshData();
  };

  const handleDataUpdated = (updatedList) => {
    // If updatedList is a Promise (from async storage ops), handle it
    if (updatedList && typeof updatedList.then === "function") {
      updatedList.then((data) => {
        if (Array.isArray(data)) setRespondents(data);
      });
    } else if (Array.isArray(updatedList)) {
      setRespondents(updatedList);
    }
    // Always re-sync from Supabase after any mutation
    refreshData();
  };

  const handleAdminLogin = () => {
    sessionStorage.setItem("tau_admin_auth", "true");
    sessionStorage.setItem("tau_active_tab", "admin");
    setIsAdminAuthenticated(true);
    setActiveTab("admin");
    refreshData();
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("tau_admin_auth");
    sessionStorage.setItem("tau_active_tab", "alumni");
    setIsAdminAuthenticated(false);
    setActiveTab("alumni");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    sessionStorage.setItem("tau_active_tab", tab);
    refreshData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isAdmin={isAdminAuthenticated && activeTab === "admin"}
        onLogout={handleAdminLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {activeTab === "alumni" ? (
          <TracerFormWizard onSubmittedSuccess={handleSubmittedSuccess} />
        ) : !isAdminAuthenticated ? (
          <AdminLoginPage onLoginSuccess={handleAdminLogin} />
        ) : isLoading ? (
          /* Loading spinner — shown while fetching data from Supabase on any device */
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <svg className="animate-spin w-12 h-12 text-[#094E96]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm text-slate-500 font-medium">Memuat data responden dari server...</p>
          </div>
        ) : (
          <AdminDashboard
            respondents={respondents}
            onDataUpdated={handleDataUpdated}
            onLogout={handleAdminLogout}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

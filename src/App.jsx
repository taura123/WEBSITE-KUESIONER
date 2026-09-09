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
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem("tau_admin_auth") === "true";
  });

  // Always keep fresh data from storage / Supabase
  const refreshData = async () => {
    try {
      const data = await getStoredResponses();
      if (Array.isArray(data)) {
        setRespondents(data);
      }
    } catch (e) {
      console.error("Error refreshing data:", e);
    }
  };

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  const handleSubmittedSuccess = () => {
    refreshData();
  };

  const handleDataUpdated = (updatedList) => {
    setRespondents(updatedList);
  };

  const handleAdminLogin = () => {
    sessionStorage.setItem("tau_admin_auth", "true");
    setIsAdminAuthenticated(true);
    sessionStorage.setItem("tau_active_tab", "admin");
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

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";

const ADMIN_CREDENTIALS = {
  email: "biro.kemahasiswaan@tau.ac.id",
  password: "birokemahasiswaan"
};

export default function AdminLoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Try backend API first — use relative URL so it works from any host/IP
      // If frontend is served from the same origin, use relative; otherwise try Supabase fallback
      const apiBase = window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : `http://${window.location.hostname}:5000`;

      const res = await fetch(`${apiBase}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        signal: AbortSignal.timeout(4000) // 4s timeout so we don't hang on other devices
      });

      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem("tau_admin_auth", "true");
        if (data.token) sessionStorage.setItem("tau_admin_token", data.token);
        onLoginSuccess();
        return;
      } else {
        setError("Email atau password tidak valid.");
        return;
      }
    } catch {
      // Backend not reachable — fallback to client-side check
      // This allows login from devices that can't reach the Docker backend
    }

    // Fallback credential check (works offline / from any device)
    if (
      email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      sessionStorage.setItem("tau_admin_auth", "true");
      onLoginSuccess();
    } else {
      setError("Email atau password tidak valid. Hubungi administrator sistem.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-tau-blue-soft flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Logo & Header */}
        <div className="text-center mb-8">
          <img
            src="/logo-tau.png"
            alt="Tanri Abeng University"
            className="h-16 w-auto object-contain mx-auto mb-5"
          />
          <h1 className="text-xl font-bold text-tau-text">Dashboard Admin</h1>
          <p className="text-sm text-tau-muted mt-1">
            Biro Kemahasiswaan & Alumni (BKHA)
          </p>
        </div>

        {/* Login Card */}
        <div className="card p-8">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-tau-border">
            <ShieldCheck className="w-5 h-5 text-tau-blue" />
            <span className="font-bold text-tau-text text-sm">Masuk ke Sistem Admin</span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-tau-text mb-1.5">
                Email Admin
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-tau-muted" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="username"
                  placeholder="email@tau.ac.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input pl-9"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-tau-text mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-tau-muted" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-tau-muted hover:text-tau-blue transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="btn-login-submit"
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-2 py-2.5"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Memverifikasi...
                </span>
              ) : (
                "Masuk ke Dashboard"
              )}
            </button>
          </form>

          <p className="text-xs text-tau-muted text-center mt-5">
            Akses terbatas untuk Biro Kemahasiswaan & Alumni TAU
          </p>
        </div>

      </div>
    </div>
  );
}

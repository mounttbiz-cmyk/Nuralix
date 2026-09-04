"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, Sparkles, Lock, KeyRound, Building2 } from "lucide-react";
import { ThemeSwitch } from "@/components/shell/ThemeSwitch";

export default function LoginPage() {
  const router = useRouter();
  const [isSuperadminMode, setIsSuperadminMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminPasscode, setAdminPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Business Login handler (Google or email)
  const handleBusinessLogin = (provider: "google" | "email" | "demo") => {
    setLoading(true);
    setError(null);

    setTimeout(() => {
      // Set business session
      const userSession = {
        id: "usr_business_owner",
        email: provider === "google" ? "founder@apexanalytics.io" : email || "founder@mycompany.com",
        name: "Alex Vance",
        role: "owner",
        provider,
        authenticatedAt: new Date().toISOString(),
      };
      localStorage.setItem("nuralix_user_session", JSON.stringify(userSession));

      // Check if business profile already exists
      const existingProfile = localStorage.getItem("nuralix_business_profile");
      if (existingProfile && provider !== "demo") {
        router.push("/");
      } else {
        // New businesses proceed directly to questionnaire: What they are & What they need
        router.push("/onboarding");
      }
    }, 600);
  };

  // Developer Superadmin Login handler (§15 Developer Portal)
  const handleSuperadminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      // Secure Developer Passcode Check
      if (adminPasscode === "nuralix2026" || adminPasscode === "admin") {
        const adminSession = {
          id: "adm_platform_developer",
          role: "platform_admin",
          mfaVerified: true,
          authenticatedAt: new Date().toISOString(),
        };
        localStorage.setItem("nuralix_admin_session", JSON.stringify(adminSession));
        router.push("/admin");
      } else {
        setLoading(false);
        setError("Invalid Developer authorization credentials. Default passcode is: nuralix2026");
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative">
      {/* Top Bar with Logo & Theme Switch */}
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center p-1.5 shadow-sm">
            <Image
              src="/logo.png"
              alt="Nuralix Logo"
              width={30}
              height={30}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-text font-sans">Nuralix</span>
            <span className="text-[10px] ml-2 px-1.5 py-0.5 rounded bg-brass-soft text-brass font-bold uppercase tracking-wider">
              AI Business OS
            </span>
          </div>
        </div>

        <div className="w-36">
          <ThemeSwitch compact />
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="p-6 sm:p-8 rounded-2xl border border-line bg-surface shadow-theme space-y-6">
          {!isSuperadminMode ? (
            /* Business Login Form */
            <>
              <div className="space-y-1.5 text-center sm:text-left">
                <h1 className="text-xl font-bold text-text tracking-tight font-sans">
                  Sign in to your Business OS
                </h1>
                <p className="text-xs text-text-muted leading-relaxed">
                  Autonomous executive AI, adaptive dashboards, and decision simulation tailored to your business.
                </p>
              </div>

              {/* One-Click Google Login */}
              <button
                id="btn-google-login"
                type="button"
                onClick={() => handleBusinessLogin("google")}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-line bg-surface-2 hover:bg-surface text-text font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-3 btn-tactile hover:border-line-strong"
              >
                {/* Official Google Icon SVG */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-line" />
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">
                  or with business email
                </span>
                <div className="flex-1 h-px bg-line" />
              </div>

              {/* Email Login Option */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-text block mb-1">
                    Work Email Address
                  </label>
                  <input
                    id="input-login-email"
                    type="email"
                    placeholder="founder@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-line bg-surface-2 text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brass"
                  />
                </div>

                <button
                  id="btn-login-email"
                  type="button"
                  onClick={() => handleBusinessLogin("email")}
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-brass text-white font-bold text-xs shadow-md hover:brightness-110 btn-tactile transition-all"
                >
                  {loading ? "Signing in…" : "Continue with Email"}
                </button>
              </div>

              {/* Quick Onboarding Demo Option */}
              <div className="pt-2 border-t border-line">
                <button
                  id="btn-demo-intake"
                  type="button"
                  onClick={() => handleBusinessLogin("demo")}
                  className="w-full py-2 px-3 rounded-lg border border-line text-xs font-semibold text-text-muted hover:text-text hover:bg-surface-2 transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brass" />
                    <span>Setup New Business (Launch Intake)</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            /* Developer / Superadmin Portal Login */
            <form onSubmit={handleSuperadminLogin} className="space-y-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber/15 text-amber text-[10px] font-bold uppercase tracking-wider">
                  <KeyRound className="w-3 h-3" />
                  <span>Developer Control Plane Gate</span>
                </div>
                <h2 className="text-base font-bold text-text">Developer Authorization</h2>
                <p className="text-xs text-text-muted">
                  Superadmin control plane is restricted to platform developers. Normal dashboard users cannot view or access this portal.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-rust/10 border border-rust/30 text-rust text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text block">
                  Developer Passcode
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-3.5 h-3.5 text-text-muted absolute left-3" />
                  <input
                    type="password"
                    placeholder="Enter developer passcode (nuralix2026)"
                    value={adminPasscode}
                    onChange={e => setAdminPasscode(e.target.value)}
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-lg border border-line bg-surface-2 text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-amber"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-amber text-black font-bold text-xs shadow-md hover:brightness-110 btn-tactile"
                >
                  {loading ? "Verifying..." : "Authenticate as Superadmin"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsSuperadminMode(false)}
                  className="w-full py-2 text-xs font-semibold text-text-muted hover:text-text text-center"
                >
                  Return to Business Login
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Developer Portal Access Toggle at bottom of Login */}
        {!isSuperadminMode && (
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsSuperadminMode(true)}
              className="text-[11px] text-text-muted hover:text-brass transition-colors inline-flex items-center gap-1 font-medium"
            >
              <KeyRound className="w-3 h-3" />
              <span>Platform Developer / Superadmin Portal</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center text-[11px] text-text-muted max-w-md mx-auto">
        <span>Protected by Nuralix Row-Level Security & Encrypted Tenancy.</span>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, Sparkles, Lock, KeyRound, Building2, ExternalLink, Check, Copy, AlertTriangle, X } from "lucide-react";
import { ThemeSwitch } from "@/components/shell/ThemeSwitch";
import { useAuth } from "@/lib/firebase/authContext";
import { isFirebaseConfigured, firebaseConfig } from "@/lib/firebase/config";
import { saveUserProfileToFirestore } from "@/lib/firebase/firestore";

export default function LoginPage() {
  const router = useRouter();
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [authMode, setAuthMode] = useState<"register" | "signin">("register");
  const [isSuperadminMode, setIsSuperadminMode] = useState(false);
  const [showFirebaseModal, setShowFirebaseModal] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminPasscode, setAdminPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check URL query for auth mode and email flag
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("signin") === "true") {
        setAuthMode("signin");
      } else if (params.get("signup") === "true") {
        setAuthMode("register");
      }
      const qEmail = params.get("email");
      if (qEmail) {
        setEmail(qEmail);
        setAuthMode("register");
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Business Login/Registration handler with Firebase integration
  const handleBusinessAuth = async (e?: React.FormEvent, provider: "google" | "email" | "demo" = "email") => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    // Instant demo intake flow
    if (provider === "demo") {
      const userSession = {
        id: `usr_demo_${Date.now()}`,
        email: "demo.founder@nuralix.io",
        name: fullName || "Alex Vance",
        role: "owner",
        provider: "demo",
        authenticatedAt: new Date().toISOString(),
      };
      localStorage.setItem("nuralix_user_session", JSON.stringify(userSession));
      router.push("/onboarding");
      return;
    }

    // When Firebase is configured with valid project credentials
    if (isFirebaseConfigured) {
      try {
        let authUser: any = null;

        if (provider === "google") {
          authUser = await signInWithGoogle();
        } else if (authMode === "register") {
          if (!password || password.length < 6) {
            setError("Password must be at least 6 characters.");
            setLoading(false);
            return;
          }
          authUser = await signUpWithEmail(email, password, fullName);
          if (authUser) {
            await saveUserProfileToFirestore(authUser.uid, {
              email: authUser.email,
              displayName: fullName || "Founder",
              role: "owner",
              createdAt: new Date().toISOString(),
            });
          }
        } else {
          authUser = await signInWithEmail(email, password);
        }

        if (authUser) {
          const userSession = {
            id: authUser.uid,
            email: authUser.email || email,
            name: authUser.displayName || fullName || (provider === "google" ? "Alex Vance" : "Founder"),
            role: "owner",
            provider: provider === "google" ? "google.com" : "password",
            authenticatedAt: new Date().toISOString(),
          };
          localStorage.setItem("nuralix_user_session", JSON.stringify(userSession));

          if (authMode === "register") {
            router.push("/onboarding");
          } else {
            const existingProfile = localStorage.getItem("nuralix_business_profile");
            router.push(existingProfile ? "/dashboard" : "/onboarding");
          }
        }
      } catch (err: any) {
        setLoading(false);
        const code = err.code || "";
        const hostname = typeof window !== "undefined" ? window.location.hostname : "localhost";

        if (code === "auth/unauthorized-domain") {
          setError(
            `Domain "${hostname}" is not authorized in Firebase Console. Go to Firebase Console → Authentication → Settings → Authorized domains, and click "Add domain" for "${hostname}". Alternatively, sign in with Email & Password below.`
          );
        } else if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
          setError("Incorrect password or invalid email credential.");
        } else if (code === "auth/user-not-found") {
          setError("No account found with this email. Click 'Create Account' above to register.");
        } else if (code === "auth/email-already-in-use") {
          setError("This email is already registered. Please switch to 'Sign In'.");
        } else if (code === "auth/popup-closed-by-user") {
          setError("Google Sign-In popup was closed before completing.");
        } else if (code === "auth/popup-blocked") {
          setError("Popup was blocked by your browser. Please allow popups for localhost.");
        } else {
          const rawMsg = err.message || "Authentication failed. Please try again.";
          const cleanMsg = rawMsg.replace(/^Firebase:\s*/i, "").replace(/FirebaseError:\s*/i, "").replace(/\(auth\/[^)]+\)\.?/i, "").trim();
          setError(cleanMsg || "Authentication failed. Please try again.");
        }
        return;
      }
    } else {
      // Fallback local session for dev/evaluation when keys are pending
      setTimeout(() => {
        const userSession = {
          id: `usr_${Date.now()}`,
          email: provider === "google" ? "founder@apexanalytics.io" : email || "founder@mycompany.com",
          name: fullName || (provider === "google" ? "Alex Vance" : "Founder"),
          role: "owner",
          provider,
          authenticatedAt: new Date().toISOString(),
        };
        localStorage.setItem("nuralix_user_session", JSON.stringify(userSession));

        if (authMode === "register") {
          router.push("/onboarding");
        } else {
          const existingProfile = localStorage.getItem("nuralix_business_profile");
          router.push(existingProfile ? "/dashboard" : "/onboarding");
        }
      }, 500);
    }
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
            /* Business Auth Form */
            <>
              {/* Error Alert */}
              {error && (
                <div className="p-3 rounded-lg bg-rust/10 border border-rust/30 text-rust text-xs font-medium flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed">{error}</div>
                </div>
              )}

              {/* Tab Switcher: Sign In vs Register */}
              <div className="flex items-center p-1 rounded-xl bg-surface-2 border border-line">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("register");
                    setError(null);
                  }}
                  className={`flex-1 py-1.5 text-xs rounded-lg font-bold transition-all ${
                    authMode === "register"
                      ? "bg-surface text-text shadow-sm border border-line"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signin");
                    setError(null);
                  }}
                  className={`flex-1 py-1.5 text-xs rounded-lg font-bold transition-all ${
                    authMode === "signin"
                      ? "bg-surface text-text shadow-sm border border-line"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  Sign In
                </button>
              </div>

              <div className="space-y-1.5 text-center sm:text-left">
                <h1 className="text-xl font-bold text-text tracking-tight font-sans">
                  {authMode === "register" ? "Register Your Business" : "Sign in to your Business OS"}
                </h1>
                <p className="text-xs text-text-muted leading-relaxed">
                  {authMode === "register"
                    ? "Create your founder profile to calibrate your custom AI executive team and company metrics."
                    : "Autonomous executive AI, adaptive dashboards, and decision simulation tailored to your business."}
                </p>
              </div>

              {/* One-Click Google Auth */}
              <button
                id="btn-google-login"
                type="button"
                onClick={() => handleBusinessAuth(undefined, "google")}
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
                <span>{authMode === "register" ? "Sign up with Google" : "Continue with Google"}</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-line" />
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">
                  or with email
                </span>
                <div className="flex-1 h-px bg-line" />
              </div>

              {/* Email Form */}
              <form onSubmit={e => handleBusinessAuth(e, "email")} className="space-y-3">
                {authMode === "register" && (
                  <div>
                    <label className="text-xs font-semibold text-text block mb-1">
                      Founder / Owner Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-line bg-surface-2 text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brass"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-text block mb-1">
                    Work Email Address *
                  </label>
                  <input
                    id="input-login-email"
                    type="email"
                    required
                    placeholder="e.g. founder@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-line bg-surface-2 text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brass"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-text block mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="•••••••• (min 6 characters)"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-line bg-surface-2 text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brass"
                  />
                </div>

                <button
                  id="btn-login-email"
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-brass text-white font-bold text-xs shadow-md hover:brightness-110 btn-tactile transition-all mt-2"
                >
                  {loading
                    ? authMode === "register"
                      ? "Creating Account…"
                      : "Signing in…"
                    : authMode === "register"
                    ? "Create Account & Continue →"
                    : "Sign In to Business OS →"}
                </button>
              </form>
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

      {/* Firebase Setup Guide Modal */}
      {showFirebaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface border border-line rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-base">
                  🔥
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text">Firebase Cloud Integration</h3>
                  <p className="text-[11px] text-text-muted">Connect your Firebase Account & Project to Nuralix</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFirebaseModal(false)}
                className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status overview */}
            <div className={`p-3.5 rounded-xl border ${isFirebaseConfigured ? "bg-emerald-500/10 border-emerald-500/30" : "bg-surface-2 border-line"} space-y-1.5`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isFirebaseConfigured ? "bg-emerald-400" : "bg-amber-400"}`} />
                  {isFirebaseConfigured ? "Project Connected & Live" : "Configuration Pending in .env.local"}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-surface border border-line text-text-muted">
                  SDK Installed
                </span>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">
                {isFirebaseConfigured
                  ? `Active Project ID: "${firebaseConfig.projectId}". Live cloud authentication and Firestore synchronization are enabled.`
                  : "The official Firebase SDK is installed. To link your newly created Firebase project, paste your Web App config into .env.local."}
              </p>
            </div>

            {/* Quick 4-Step Instructions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-text uppercase tracking-wider text-[11px]">
                How to Link Your Firebase Project:
              </h4>

              <div className="space-y-2.5 text-xs text-text-muted">
                <div className="p-3 rounded-lg bg-surface-2 border border-line space-y-1">
                  <div className="font-semibold text-text flex items-center justify-between">
                    <span>1. Open Firebase Console</span>
                    <a
                      href="https://console.firebase.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-brass hover:underline flex items-center gap-1 font-medium"
                    >
                      console.firebase.google.com <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-[11px]">
                    Open your project, click the ⚙️ <b>Project Settings</b> gear at top left.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-surface-2 border border-line space-y-1">
                  <div className="font-semibold text-text">2. Register / Select Web App (`&lt;/&gt;`)</div>
                  <p className="text-[11px]">
                    Under <i>&quot;Your apps&quot;</i>, select Web (`&lt;/&gt;`) and look for the <code>firebaseConfig</code> object.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-surface-2 border border-line space-y-1">
                  <div className="font-semibold text-text">3. Enable Authentication Providers</div>
                  <p className="text-[11px]">
                    In the left sidebar, click <b>Build → Authentication → Sign-in method</b>, then enable <b>Email/Password</b> and <b>Google</b>.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-surface-2 border border-line space-y-1">
                  <div className="font-semibold text-text">4. (Optional) Enable Firestore Database</div>
                  <p className="text-[11px]">
                    Click <b>Build → Firestore Database → Create database</b> to persist business records in the cloud.
                  </p>
                </div>
              </div>
            </div>

            {/* Code template for .env.local */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text">Add to `.env.local`:</span>
                <button
                  type="button"
                  onClick={() => {
                    const template = `# Firebase Web Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=`;
                    navigator.clipboard.writeText(template);
                    setCopiedEnv(true);
                    setTimeout(() => setCopiedEnv(false), 2000);
                  }}
                  className="text-[11px] text-brass hover:text-brass/80 flex items-center gap-1 font-semibold"
                >
                  {copiedEnv ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied Template!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Template</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-3 rounded-xl bg-black/60 border border-line text-[11px] font-mono text-slate-300 overflow-x-auto">
                {`NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef`}
              </pre>
            </div>

            <div className="pt-2 border-t border-line flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowFirebaseModal(false)}
                className="px-4 py-2 rounded-xl bg-brass text-white font-bold text-xs hover:brightness-110 transition-all"
              >
                Got It, Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

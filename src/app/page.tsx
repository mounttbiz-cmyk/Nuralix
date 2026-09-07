"use client";

import dynamic from "next/dynamic";

const WebsiteApp = dynamic(() => import("@/website/App"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#05060A] flex items-center justify-center text-white">
      <div className="text-xl font-bold tracking-widest text-[#00D9FF] animate-pulse">
        NURALIX
      </div>
    </div>
  ),
});

export default function RootPage() {
  return <WebsiteApp />;
}

import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-300 font-sans p-4 md:p-8">
      {/* Header / Navbar */}
      <header className="flex justify-between items-center mb-12">
        <div className="text-2xl font-black tracking-tighter text-[#22d3ee]">
          GIGALINK
        </div>
        <div className="px-4 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-medium">
          System Status: Error 404
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Page Not Found</h1>
      </main>
    </div>
  );
}

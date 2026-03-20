"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-white/[0.06] bg-[var(--surface)]/80 backdrop-blur-xl h-16 flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Search candidates, questions..."
          className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2 text-sm text-white/80 placeholder:text-white/25 focus:outline-none focus:border-indigo-500/40 focus:bg-white/[0.06] transition-all duration-200"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 ml-4">
        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all duration-200">
          <Bell size={16} className="text-white/50" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-3 pl-3 border-l border-white/[0.06]">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-500/20">
            A
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white/80">Admin</p>
            <p className="text-[11px] text-white/30">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}

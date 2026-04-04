"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Brain,
  Settings,
  FileText,
  PlayCircle,
  ClipboardList,
  LogOut,
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/candidates", label: "Candidates", icon: Users },
  { href: "/questions", label: "Questions", icon: FileText },
  { href: "/templates", label: "Templates", icon: ClipboardList },
  // { href: "/playback", label: "Playback", icon: PlayCircle },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/model-performance", label: "Model", icon: Brain },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside className="w-64 border-r border-white/[0.06] bg-[var(--surface)] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight">AI Interview</h1>
            <p className="text-[11px] text-white/40 font-medium">Evaluator Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 mb-2 text-[11px] font-semibold text-white/30 uppercase tracking-wider">
          Menu
        </p>
        {links.map(({ href, label, icon: Icon }) => {
          const active = path.startsWith(`/admin${href}`);
          return (
            <Link
              key={href}
              href={`/admin${href}`}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${active
                  ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-white border border-indigo-500/20 shadow-lg shadow-indigo-500/5"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                }`}
            >
              <Icon
                size={18}
                className={`transition-colors duration-200 ${active ? "text-indigo-400" : "text-white/40 group-hover:text-white/60"
                  }`}
              />
              {label}
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-white/[0.06]">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

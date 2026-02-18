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
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/candidates", label: "Candidates", icon: Users },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/model-performance", label: "Model", icon: Brain },
  { href: "/questions", label: "Questions", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside className="w-64 border-r bg-background">
      <div className="p-6 text-xl font-semibold">AI Interview</div>

      <nav className="space-y-1 px-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active = path.startsWith(`/admin${href}`);
          return (
            <Link
              key={href}
              href={`/admin${href}`}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm
              ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

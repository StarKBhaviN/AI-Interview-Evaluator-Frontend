import { ReactNode } from "react";
import Header from "@/features/admin/components/header";
import Sidebar from "@/features/admin/components/sidebar";
import AuthGuard from "@/components/auth/AuthGuard";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requiredRole="Admin">
      <div className="flex h-screen bg-[var(--background)] bg-mesh">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

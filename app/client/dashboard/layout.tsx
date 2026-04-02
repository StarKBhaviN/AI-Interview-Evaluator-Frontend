import AuthGuard from "@/components/auth/AuthGuard";
import { ReactNode } from "react";

export default function ClientDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requiredRole="Client">
      {children}
    </AuthGuard>
  );
}

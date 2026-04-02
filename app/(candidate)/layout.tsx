import AuthGuard from "@/components/auth/AuthGuard";
import { ReactNode } from "react";

export default function CandidateLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requiredRole="Candidate">
      {children}
    </AuthGuard>
  );
}

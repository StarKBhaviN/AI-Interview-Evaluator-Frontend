import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Candidate' | 'Client' | 'Admin';
  company?: string;
};

type AppState = {
  loading: boolean;
  setLoading: (v: boolean) => void;
  resumeFile: any; // Using any for simplicity with File object in store
  setResumeFile: (file: any) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      loading: false,
      setLoading: (v) => set({ loading: v }),
      resumeFile: null,
      setResumeFile: (file) => set({ resumeFile: file }),
      user: null,
      setUser: (user) => set({ user }),
      logout: () => {
        // Clear all persistent states
        sessionStorage.clear();
        localStorage.removeItem('candidateData');
        localStorage.removeItem('clientData');
        set({ user: null, resumeFile: null });
      },
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "ai-interview-auth",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

import { create } from "zustand";

type AppState = {
  loading: boolean;
  setLoading: (v: boolean) => void;
  resumeFile: File | null;
  setResumeFile: (file: File | null) => void;
};

export const useAppStore = create<AppState>((set) => ({
  loading: false,
  setLoading: (v) => set({ loading: v }),
  resumeFile: null,
  setResumeFile: (file) => set({ resumeFile: file }),
}));

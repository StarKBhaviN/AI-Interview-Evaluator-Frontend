import { create } from "zustand";

export type Question = {
  id: string;
  text: string;
  timeLimit: number;
};

type InterviewState = {
  questions: Question[];
  currentIndex: number;
  isRecording: boolean;
  transcript: string;
  confidence: number;

  startRecording: () => void;
  stopRecording: () => void;
  nextQuestion: () => void;
  setTranscript: (t: string) => void;
  setConfidence: (c: number) => void;
};

export const useInterviewStore = create<InterviewState>((set) => ({
  questions: [],
  currentIndex: 0,
  isRecording: false,
  transcript: "",
  confidence: 0,

  startRecording: () => set({ isRecording: true }),
  stopRecording: () => set({ isRecording: false }),

  nextQuestion: () =>
    set((s) => ({ currentIndex: s.currentIndex + 1 })),

  setTranscript: (t) => set({ transcript: t }),
  setConfidence: (c) => set({ confidence: c }),
}));

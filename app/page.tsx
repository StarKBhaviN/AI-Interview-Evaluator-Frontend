"use client";

import { useEffect, useState } from "react";
import { Mic, Camera, Wifi, Brain } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const checkItems = [
  { icon: Brain, label: "Loading AI Models" },
  { icon: Mic, label: "Detecting Microphone" },
  { icon: Camera, label: "Detecting Camera" },
  { icon: Wifi, label: "Checking Connection" },
];

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [currentCheck, setCurrentCheck] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setReady(true);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    const checkInterval = setInterval(() => {
      setCurrentCheck((prev) =>
        prev < checkItems.length - 1 ? prev + 1 : prev
      );
    }, 800);

    return () => {
      clearInterval(interval);
      clearInterval(checkInterval);
    };
  }, []);

  const handleStart = () => {
    window.location.href = "/system-check";
  };

  return (
    <div className="min-h-screen bg-[var(--background)] bg-mesh flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float animate-delay-500" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full animate-fade-in-up">
        {/* Logo */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30 animate-pulse-glow">
            <Brain className="w-12 h-12 text-white" />
          </div>
          {/* Orbiting dots */}
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400/50" />
          </div>
          <div className="absolute inset-0 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "12s" }}>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight text-center">
          AI Interview Evaluator
        </h1>
        <p className="text-white/40 text-sm mb-10 text-center">
          Intelligent Assessment Platform
        </p>

        {/* Progress card */}
        <div className="glass rounded-2xl p-6 w-full mb-6">
          <p className="text-sm font-medium text-white/60 mb-4 text-center">
            {ready ? "System Ready" : "Initializing AI Engine…"}
          </p>

          <Progress value={progress} variant="gradient" size="md" className="mb-6" />

          {/* Check items */}
          <div className="space-y-3">
            {checkItems.map((item, index) => {
              const Icon = item.icon;
              const isDone = index < currentCheck || ready;
              const isCurrent = index === currentCheck && !ready;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                    isDone
                      ? "text-emerald-400"
                      : isCurrent
                      ? "text-white"
                      : "text-white/20"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isDone
                        ? "bg-emerald-500/15"
                        : isCurrent
                        ? "bg-indigo-500/15"
                        : "bg-white/[0.03]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                  {isDone && (
                    <span className="ml-auto text-xs text-emerald-400/70">✓</span>
                  )}
                  {isCurrent && (
                    <div className="ml-auto w-4 h-4 border-2 border-indigo-400/50 border-t-indigo-400 rounded-full animate-spin" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Start button */}
        {ready && (
          <button
            onClick={handleStart}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 animate-fade-in-up"
          >
            Begin System Check
          </button>
        )}

        {/* Footer */}
        <p className="text-white/20 text-xs mt-8">v1.0.0 — Powered by AI</p>
      </div>
    </div>
  );
}

"use client"
/**
 * API Client — Centralized API layer for the AI Interview platform.
 * All backend communication routes through here.
 * 
 * BUG-5 FIX: Uses getBaseUrl() consistently instead of the synchronous BACKEND_URL export.
 */

// --- Dynamic Base URL ---
let _cachedUrl: string | null = null;

export async function getBaseUrl(): Promise<string> {
  if (_cachedUrl) return _cachedUrl;
  
  try {
    // @ts-ignore — Tauri-specific dynamic import
    const { getEnv } = await import("@/lib/env");
    const env = await getEnv();
    _cachedUrl = env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  } catch {
    _cachedUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  }
  
  return _cachedUrl;
}

// Legacy synchronous export (used by components that import directly)
// DEPRECATED: Use getBaseUrl() instead for correctness
export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";


// --- Type Definitions ---
export interface AnalysisResponse {
  transcript: string;
  relevance_score: number;
  confidence_score: number;
  sentiment: string;
  keywords_found: string[];
  is_technical: boolean;
  final_score: number;
  questionIndex?: number;
}

export interface InterviewReport {
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  strengths: string[];
  improvements: string[];
}

// --- Helper ---
async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const base = await getBaseUrl();
  const url = `${base}${path}`;
  const res = await fetch(url, options);
  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(detail.detail || `API Error: ${res.status}`);
  }
  return res;
}

// =====================
//  Auth Endpoints
// =====================

export async function signUp(data: { name: string; email: string; password: string; role: string; company?: string }) {
  const res = await apiFetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function signIn(data: { email: string; password: string }) {
  const res = await apiFetch("/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function resetPassword(data: { email: string; current_password: string; new_password: string }) {
  const res = await apiFetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// =====================
//  Interview Endpoints
// =====================

export async function analyzeAudio(audioPath: string, question?: string, skills?: string[]): Promise<AnalysisResponse> {
  const base = await getBaseUrl();

  // Read the audio file from Tauri's local filesystem
  const { readFile } = await import("@tauri-apps/plugin-fs");
  const fileBytes = await readFile(audioPath);
  const blob = new Blob([fileBytes], { type: "audio/wav" });

  const formData = new FormData();
  formData.append("file", blob, "recording.wav");
  if (question) formData.append("question", question);
  if (skills && skills.length > 0) formData.append("skills", skills.join(","));

  const res = await fetch(`${base}/analyze-audio`, { method: "POST", body: formData });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(detail.detail || `Analysis failed: ${res.status}`);
  }
  return res.json();
}

export async function generateQuestions(skills: string[], position: string) {
  const res = await apiFetch("/api/generate-questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skills, position }),
  });
  return res.json();
}

export async function generateReport(results: any[], warnings: any[]) {
  const res = await apiFetch("/generate-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ results, warnings }),
  });
  return res.json();
}

// =====================
//  Client (Employer) Endpoints
// =====================

export async function getClientMeetings(clientId?: string): Promise<any[]> {
  const query = clientId ? `?client_id=${clientId}` : "";
  const res = await apiFetch(`/api/client/meetings${query}`);
  return res.json();
}

export async function createMeeting(meeting: any) {
  const res = await apiFetch("/api/client/meetings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(meeting),
  });
  return res.json();
}

export async function updateMeeting(meetingId: string, update: any) {
  const res = await apiFetch(`/api/client/meetings/${meetingId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(update),
  });
  return res.json();
}

export async function updateMeetingStatus(meetingId: string, status: string) {
  const res = await apiFetch(`/api/client/meetings/${meetingId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function deleteMeeting(meetingId: string) {
  const res = await apiFetch(`/api/client/meetings/${meetingId}`, { method: "DELETE" });
  return res.json();
}

export async function getMeetingQuestions(code: string) {
  const res = await apiFetch(`/api/client/meetings/by-code/${code}/questions`);
  return res.json();
}

export async function getClientStats(clientId?: string) {
  const query = clientId ? `?client_id=${clientId}` : "";
  const res = await apiFetch(`/api/client/stats${query}`);
  return res.json();
}

export async function getClientCandidates(clientId?: string) {
  const query = clientId ? `?client_id=${clientId}` : "";
  const res = await apiFetch(`/api/client/candidates${query}`);
  return res.json();
}

export async function shortlistCandidate(sessionId: string, shortlisted: boolean) {
  const res = await apiFetch(`/api/client/candidates/${sessionId}/shortlist`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shortlisted }),
  });
  return res.json();
}

// =====================
//  Admin Endpoints
// =====================

export async function getAdminStats() {
  const res = await apiFetch("/api/admin/stats");
  return res.json();
}

export async function getAdminSessions(page = 1, limit = 50, search = "") {
  const res = await apiFetch(`/api/admin/sessions?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
  return res.json();
}

export async function getAdminSession(sessionId: string) {
  const res = await apiFetch(`/api/admin/sessions/${sessionId}`);
  return res.json();
}

export async function deleteSession(sessionId: string) {
  const res = await apiFetch(`/api/admin/sessions/${sessionId}`, { method: "DELETE" });
  return res.json();
}

export async function getAdminClients() {
  const res = await apiFetch("/api/admin/clients");
  return res.json();
}

export async function getAdminCandidates() {
  const res = await apiFetch("/api/admin/candidates");
  return res.json();
}

export async function terminateUser(userId: string) {
  const res = await apiFetch(`/api/admin/users/${userId}`, { method: "DELETE" });
  return res.json();
}

export async function getAdminAnalytics() {
  const res = await apiFetch("/api/admin/analytics");
  return res.json();
}

export async function exportAdminCSV() {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/admin/export`);
  return res.blob();
}

export async function submitSession(session: any) {
  const res = await apiFetch("/api/admin/sessions/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(session),
  });
  return res.json();
}

export async function uploadAudio(audioPath: string, sessionId: string, questionIndex: number) {
  // Read the audio file from Tauri's local filesystem
  const { readFile } = await import("@tauri-apps/plugin-fs");
  const fileBytes = await readFile(audioPath);
  const blob = new Blob([fileBytes], { type: "audio/wav" });

  const formData = new FormData();
  formData.append("file", blob, `${sessionId}_${questionIndex}.wav`);
  formData.append("session_id", sessionId);
  formData.append("question_index", questionIndex.toString());
  
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/admin/audio/upload`, { method: "POST", body: formData });
  return res.json();
}

// =====================
//  AI / ML Endpoints
// =====================

export async function getAIStatus() {
  const res = await apiFetch("/api/ai/status");
  return res.json();
}

export async function trainRelevanceModel() {
  const res = await apiFetch("/api/ai/train-relevance", { method: "POST" });
  return res.json();
}

// =====================
//  Resume Endpoint
// =====================

export async function parseResume(formData: FormData) {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/parse-resume`, { method: "POST", body: formData });
  return res.json();
}

const BACKEND_URL = 'http://localhost:8000';

export interface AnalysisResponse {
  transcript: string;
  relevance_score: number;
  confidence_score: number;
  sentiment: string;
  keywords_found: string[];
  questionIndex?: number;
  questionText?: string;
  audioPath?: string;
}

export async function analyzeAudio(filePath: string, question?: string, skills?: string[]): Promise<AnalysisResponse> {
  console.log(`[analyzeAudio] Starting analysis for file: ${filePath}`);
  
  // We use Tauri's File API to read the file and send it
  const { readFile } = await import('@tauri-apps/plugin-fs');
  let audioData: Uint8Array;
  try {
    audioData = await readFile(filePath);
    console.log(`[analyzeAudio] File read successfully. Size: ${audioData.length} bytes`);
  } catch (err) {
    console.error(`[analyzeAudio] Failed to read file: ${filePath}`, err);
    throw new Error(`Failed to read audio file: ${err}`);
  }

  const blob = new Blob([audioData as any], { type: 'audio/wav' });

  
  const formData = new FormData();
  formData.append('file', blob, 'recording.wav');
  if (question) formData.append('question', question);
  if (skills) formData.append('skills', skills.join(','));

  console.log(`[analyzeAudio] Sending request to backend...`);
  const response = await fetch(`${BACKEND_URL}/analyze-audio`, {
    method: 'POST',
    body: formData,
  });

  console.log(`[analyzeAudio] Backend response status: ${response.status} ${response.statusText}`);



  if (!response.ok) {
    throw new Error(`Failed to analyze audio: ${response.statusText}`);
  }

  return response.json();
}

export async function parseResume(file: File): Promise<{ skills: string[] }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BACKEND_URL}/api/parse-resume`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to parse resume: ${response.statusText}`);
  }

  return response.json();
}

export interface InterviewReport {
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  strengths: string[];
  improvements: string[];
  summary: string;
}

export async function generateReport(results: AnalysisResponse[], warnings: any[]): Promise<InterviewReport> {
  const response = await fetch(`${BACKEND_URL}/generate-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ results, warnings }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate report: ${response.statusText}`);
  }

  return response.json();
}

export interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: string;
  tags: string[];
  keywords: string[];
}

export async function generateInterviewQuestions(skills: string[], position: string): Promise<Question[]> {
  const response = await fetch(`${BACKEND_URL}/api/generate-questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skills, position }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate questions: ${response.statusText}`);
  }

  return response.json();
}

export async function submitSession(sessionData: any): Promise<{ status: string; session_id: string }> {
  const response = await fetch(`${BACKEND_URL}/api/admin/sessions/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sessionData),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit session: ${response.statusText}`);
  }

  return response.json();
}

export async function uploadAudio(filePath: string, sessionId: string, questionIndex: number): Promise<{ status: string }> {
  const { readFile } = await import('@tauri-apps/plugin-fs');
  const audioData = await readFile(filePath);
  const blob = new Blob([audioData as any], { type: 'audio/wav' });

  const formData = new FormData();
  formData.append('file', blob, `recording_${questionIndex}.wav`);
  formData.append('session_id', sessionId);
  formData.append('question_index', questionIndex.toString());

  const response = await fetch(`${BACKEND_URL}/api/admin/audio/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload audio: ${response.statusText}`);
  }

  return response.json();
}
export async function getClientMeetings(clientId?: string): Promise<any[]> {
  const url = clientId ? `${BACKEND_URL}/api/client/meetings?client_id=${clientId}` : `${BACKEND_URL}/api/client/meetings`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch meetings');
  return response.json();
}

export async function createClientMeeting(meetingData: any): Promise<any> {
  const response = await fetch(`${BACKEND_URL}/api/client/meetings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(meetingData),
  });
  if (!response.ok) throw new Error('Failed to create meeting');
  return response.json();
}

export async function getClientStats(clientId?: string): Promise<any> {
  const url = clientId ? `${BACKEND_URL}/api/client/stats?client_id=${clientId}` : `${BACKEND_URL}/api/client/stats`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
}

export async function getClientCandidates(clientId?: string): Promise<any[]> {
  const url = clientId ? `${BACKEND_URL}/api/client/candidates?client_id=${clientId}` : `${BACKEND_URL}/api/client/candidates`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch candidates');
  return response.json();
}

export async function deleteClientMeeting(meetingId: string): Promise<any> {
  const response = await fetch(`${BACKEND_URL}/api/client/meetings/${meetingId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete meeting');
  return response.json();
}

export async function updateMeetingStatus(meetingId: string, status: string): Promise<any> {
  const response = await fetch(`${BACKEND_URL}/api/client/meetings/${meetingId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update meeting status');
  return response.json();
}

export async function getMeetingQuestions(code: string): Promise<{ questions: Question[]; title: string; company: string }> {
  const response = await fetch(`${BACKEND_URL}/api/client/meetings/by-code/${code}/questions`);
  if (!response.ok) throw new Error('Failed to fetch meeting questions');
  return response.json();
}

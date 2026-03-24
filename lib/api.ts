const BACKEND_URL = 'http://localhost:8000';

export interface AnalysisResponse {
  transcript: string;
  relevance_score: number;
  confidence_score: number;
  sentiment: string;
  keywords_found: string[];
}

export async function analyzeAudio(filePath: string): Promise<AnalysisResponse> {
  // We use Tauri's File API to read the file and send it
  // Or even better, we can use tauri-plugin-http if needed, but standard fetch works if we have the blob
  
  const { readFile } = await import('@tauri-apps/plugin-fs');
  const audioData = await readFile(filePath);
  const blob = new Blob([audioData], { type: 'audio/wav' });
  
  const formData = new FormData();
  formData.append('file', blob, 'recording.wav');

  const response = await fetch(`${BACKEND_URL}/analyze-audio`, {
    method: 'POST',
    body: formData,
  });

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

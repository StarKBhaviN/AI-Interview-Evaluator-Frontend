const BACKEND_URL = 'http://localhost:8000';

export interface AnalysisResponse {
  transcript: string;
  relevance_score: number;
  confidence_score: number;
  sentiment: string;
  keywords_found: string[];
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

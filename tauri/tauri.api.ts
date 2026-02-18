import { invoke } from "@tauri-apps/api/core";

export async function startAudioCapture() {
  return await invoke("start_audio_capture");
}

export async function stopAudioCapture() {
  return await invoke("stop_audio_capture");
}

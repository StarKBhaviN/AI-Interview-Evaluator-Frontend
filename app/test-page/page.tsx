"use client";

import { ui } from "@/theme/ui";
import { useInterviewStore } from "@/features/interview/store/interview.store";
import { startAudioCapture, stopAudioCapture } from "@/tauri/tauri.api";
import { Button } from "@/components/ui/button";

export default function TestPage() {
  const { isRecording, startRecording, stopRecording } = useInterviewStore();

  const handleStart = async () => {
    await startAudioCapture();
    startRecording();
  };

  const handleStop = async () => {
    await stopAudioCapture();
    stopRecording();
  };

  return (
    <div className={ui.page()}>
      <div className={ui.container()}>
        <div className={ui.card()}>
          <h1 className={ui.sectionTitle()}>Interview Test</h1>

          {isRecording ? (
            <Button variant="destructive" onClick={handleStop}>
              Stop Recording
            </Button>
          ) : (
            <Button onClick={handleStart}>
              Start Recording
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

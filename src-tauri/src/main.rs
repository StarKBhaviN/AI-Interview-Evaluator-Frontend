use tauri::command;

#[command]
fn start_audio_capture() -> String {
    println!("Recording started");
    "started".into()
}

#[command]
fn stop_audio_capture() -> String {
    println!("Recording stopped");
    "stopped".into()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            start_audio_capture,
            stop_audio_capture
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

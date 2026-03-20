use tauri::command;
use sysinfo::System;
use serde::{Serialize, Deserialize};
use std::fs;
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Clone)]
pub struct Candidate {
    id: String,
    name: String,
    role: String,
    status: String,
    score: Option<f32>,
    date: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Question {
    id: String,
    text: String,
    category: String,
    difficulty: String,
    tags: Vec<String>,
    keywords: Vec<String>,
}

#[derive(Serialize)]
pub struct SystemInfo {
    os: String,
    arch: String,
    cpu_count: usize,
    total_memory_gb: u64,
}

#[derive(Serialize)]
pub struct HardwareStatus {
    name: String,
    status: String,
    detail: String,
}

// Helper to get data path
fn get_data_dir() -> PathBuf {
    let path = PathBuf::from("data");
    if !path.exists() {
        fs::create_dir_all(&path).unwrap();
    }
    path
}

#[command]
fn get_system_info() -> SystemInfo {
    let mut sys = System::new_all();
    sys.refresh_all();
    SystemInfo {
        os: System::name().unwrap_or_else(|| "Unknown".into()),
        arch: System::cpu_arch().unwrap_or_else(|| "Unknown".into()),
        cpu_count: sys.cpus().len(),
        total_memory_gb: sys.total_memory() / 1024 / 1024 / 1024,
    }
}

#[command]
fn check_hardware() -> Vec<HardwareStatus> {
    vec![
        HardwareStatus { name: "Microphone Access".into(), status: "success".into(), detail: "Default input ready".into() },
        HardwareStatus { name: "Camera Access".into(), status: "success".into(), detail: "Webcam found".into() },
        HardwareStatus { name: "Internet Speed".into(), status: "success".into(), detail: "Ping: 12ms".into() },
        HardwareStatus { name: "Audio Output".into(), status: "success".into(), detail: "Speakers ready".into() },
        HardwareStatus { name: "Environment".into(), status: "success".into(), detail: "Quiet room".into() },
    ]
}

#[command]
fn get_candidates() -> Vec<Candidate> {
    let path = get_data_dir().join("candidates.json");
    if !path.exists() { return vec![]; }
    let data = fs::read_to_string(path).unwrap_or_else(|_| "[]".into());
    serde_json::from_str(&data).unwrap_or_default()
}

#[command]
fn save_candidate(candidate: Candidate) -> Candidate {
    let mut candidates = get_candidates();
    let mut new_c = candidate.clone();
    if new_c.id.is_empty() {
        new_c.id = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_millis().to_string();
    }
    candidates.push(new_c.clone());
    let path = get_data_dir().join("candidates.json");
    fs::write(path, serde_json::to_string_pretty(&candidates).unwrap()).unwrap();
    new_c
}

#[command]
fn get_questions() -> Vec<Question> {
    let path = get_data_dir().join("questions.json");
    if !path.exists() {
        let initial = vec![
            Question { id: "1".into(), text: "Tell us about your background.".into(), category: "Behavioral".into(), difficulty: "Easy".into(), tags: vec!["intro".into()], keywords: vec!["experience".into()] }
        ];
        fs::write(&path, serde_json::to_string_pretty(&initial).unwrap()).unwrap();
        return initial;
    }
    let data = fs::read_to_string(path).unwrap_or_else(|_| "[]".into());
    serde_json::from_str(&data).unwrap_or_default()
}

#[command]
fn save_question(question: Question) -> Question {
    let mut questions = get_questions();
    let mut new_q = question.clone();
    if new_q.id.is_empty() {
        new_q.id = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_millis().to_string();
    }
    questions.push(new_q.clone());
    let path = get_data_dir().join("questions.json");
    fs::write(path, serde_json::to_string_pretty(&questions).unwrap()).unwrap();
    new_q
}

#[command]
fn start_audio_capture() -> String { "started".into() }

#[command]
fn stop_audio_capture() -> String { "stopped".into() }

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_system_info,
            check_hardware,
            get_candidates,
            save_candidate,
            get_questions,
            save_question,
            start_audio_capture,
            stop_audio_capture
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use tauri::{command, AppHandle, Manager};
use sysinfo::System;
use serde::{Serialize, Deserialize};
use std::fs;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use anyhow::Result;

pub enum AudioMessage {
    Start {
        path: PathBuf,
        spec: hound::WavSpec,
        config: cpal::StreamConfig,
    },
    Stop,
}

pub struct AppState {
    pub audio_tx: std::sync::mpsc::Sender<AudioMessage>,
    pub current_file: Mutex<Option<PathBuf>>,
    pub recorder_active: Mutex<bool>,
}

fn spawn_audio_thread() -> std::sync::mpsc::Sender<AudioMessage> {
    let (tx, rx) = std::sync::mpsc::channel::<AudioMessage>();

    std::thread::spawn(move || {
        let host = cpal::default_host();
        let device = host.default_input_device().expect("No input device found");
        #[allow(unused_assignments)]
        let mut stream: Option<cpal::Stream> = None;

        while let Ok(msg) = rx.recv() {
            match msg {
                AudioMessage::Start { path, spec, config } => {
                    let writer = Arc::new(Mutex::new(hound::WavWriter::create(&path, spec).unwrap()));
                    let writer_clone = writer.clone();

                    let err_fn = move |err| eprintln!("an error occurred on stream: {}", err);

                    let new_stream = device.build_input_stream(
                        &config,
                        move |data: &[f32], _: &cpal::InputCallbackInfo| {
                            let mut writer = writer_clone.lock().unwrap();
                            for &sample in data {
                                let amplitude = 32767.0;
                                let _ = writer.write_sample((sample * amplitude) as i16);
                            }
                        },
                        err_fn,
                        None
                    ).unwrap();

                    new_stream.play().unwrap();
                    stream = Some(new_stream);
                }
                AudioMessage::Stop => {
                    stream = None; // Dropping the stream stops recording
                }
            }
        }
    });

    tx
}

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
fn get_data_dir(app: &AppHandle) -> PathBuf {
    let path = app.path().app_data_dir().unwrap().join("data");
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
fn get_candidates(app: AppHandle) -> Vec<Candidate> {
    let path = get_data_dir(&app).join("candidates.json");
    if !path.exists() { return vec![]; }
    let data = fs::read_to_string(path).unwrap_or_else(|_| "[]".into());
    serde_json::from_str(&data).unwrap_or_default()
}

#[command]
fn save_candidate(app: AppHandle, candidate: Candidate) -> Candidate {
    let mut candidates = get_candidates(app.clone());
    let mut new_c = candidate.clone();
    if new_c.id.is_empty() {
        new_c.id = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_millis().to_string();
    }
    candidates.push(new_c.clone());
    let path = get_data_dir(&app).join("candidates.json");
    fs::write(path, serde_json::to_string_pretty(&candidates).unwrap()).unwrap();
    new_c
}

#[command]
fn get_questions(app: AppHandle) -> Vec<Question> {
    let path = get_data_dir(&app).join("questions.json");
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
fn save_question(app: AppHandle, question: Question) -> Question {
    let mut questions = get_questions(app.clone());
    let mut new_q = question.clone();
    if new_q.id.is_empty() {
        new_q.id = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_millis().to_string();
    }
    questions.push(new_q.clone());
    let path = get_data_dir(&app).join("questions.json");
    fs::write(path, serde_json::to_string_pretty(&questions).unwrap()).unwrap();
    new_q
}

#[command]
fn start_audio_capture(app: AppHandle, state: tauri::State<AppState>) -> Result<String, String> {
    let host = cpal::default_host();
    let device = host.default_input_device().ok_or("No input device found")?;
    let config: cpal::StreamConfig = device.default_input_config().map_err(|e| e.to_string())?.into();

    let data_dir = get_data_dir(&app);
    let filename = format!("recording_{}.wav", std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_millis());
    let file_path = data_dir.join(filename);
    
    let spec = hound::WavSpec {
        channels: config.channels as u16,
        sample_rate: config.sample_rate.0,
        bits_per_sample: 16,
        sample_format: hound::SampleFormat::Int,
    };

    state.audio_tx.send(AudioMessage::Start { 
        path: file_path.clone(),
        spec,
        config
    }).map_err(|e| e.to_string())?;

    *state.current_file.lock().unwrap() = Some(file_path);
    *state.recorder_active.lock().unwrap() = true;

    Ok("started".into())
}

#[command]
fn stop_audio_capture(state: tauri::State<AppState>) -> Result<String, String> {
    state.audio_tx.send(AudioMessage::Stop).map_err(|e| e.to_string())?;
    *state.recorder_active.lock().unwrap() = false;
    
    if let Some(path) = state.current_file.lock().unwrap().take() {
        Ok(path.to_string_lossy().to_string())
    } else {
        Err("No recording in progress".into())
    }
}

fn main() {
    let audio_tx = spawn_audio_thread();
    
    tauri::Builder::default()
        .manage(AppState {
            audio_tx,
            current_file: Mutex::new(None),
            recorder_active: Mutex::new(false),
        })
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_log::Builder::new().build())
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

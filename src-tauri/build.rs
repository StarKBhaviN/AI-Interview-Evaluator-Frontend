fn main() {
    // 1. Load the .env file from the frontend root
    // Try current dir, then parent
    dotenv::from_filename(".env").ok();
    dotenv::from_filename("../.env").ok();

    // 2. Tell Cargo to re-run this script if .env changes
    println!("cargo:rerun-if-changed=../.env");
    println!("cargo:rerun-if-changed=.env");

    // 3. For any environment variable we care about, pass it to the compiler
    // so it's available via option_env!() in the main code.
    let keys = ["NEXT_PUBLIC_API_URL", "API_URL"];
    for key in keys {
        if let Ok(val) = std::env::var(key) {
            println!("cargo:rustc-env={}={}", key, val);
        }
    }

    tauri_build::build()
}

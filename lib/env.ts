import { invoke } from "@tauri-apps/api/core";

/**
 * Fetches an environment variable from the Rust backend.
 * Falls back to process.env for web/development compatibility.
 */
export async function getEnv(name: string): Promise<string> {
  // Try Tauri invoke first
  try {
    const value = await invoke<string>("get_env", { name });
    if (value) return value;
  } catch (err) {
    // If not in Tauri or command fails, fallback to process.env
    console.debug(`Tauri get_env failed for ${name}, falling back to process.env`);
  }

  // Fallback to Next.js process.env (available during build/dev)
  // Prefix with NEXT_PUBLIC_ if not already there, as Next.js only exposes those to the client
  const publicName = name.startsWith('NEXT_PUBLIC_') ? name : `NEXT_PUBLIC_${name}`;
  return process.env[name] || process.env[publicName] || "";
}

/**
 * Helper to get the Backend URL specifically
 */
export async function getBackendUrl(): Promise<string> {
  const url = await getEnv("API_URL");
  return url || 'http://localhost:8000';
}

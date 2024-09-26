// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#[cfg(desktop)]
mod app;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
use tauri::Builder;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let tauri_app = Builder::default();

    std::env::remove_var("HTTP_PROXY");
    std::env::remove_var("HTTPS_PROXY");
    std::env::remove_var("ALL_PROXY");

    let mut builder = tauri_app
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_clipboard_manager::init());

    #[cfg(all(desktop))]
    {
        builder = builder.setup(|app| {
            use app::tray::create_tray;
            let handle = app.handle();
            let _ = create_tray(handle)?;
            Ok(())
        })
    }
    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

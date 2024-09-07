// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#[cfg(desktop)]
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
use tauri::Builder;

mod app;
use app::tray::create_tray;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let tauri_app = Builder::default();

    tauri_app
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_notification::init())
        .setup(|app| {
            #[cfg(all(desktop))]
            {
                let handle = app.handle();
                create_tray(handle)?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

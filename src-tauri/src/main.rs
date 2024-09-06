// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

mod app;

use api::greet;
use app::{api, tray, window};
use tauri::{generate_handler, Builder};
use tray::{create_tray, system_tray_event_handler};
use window::{create_window_menu, window_event_handler};

fn main() {
    let tauri_app = Builder::default();
    tauri_app
        .invoke_handler(generate_handler![greet])
        .system_tray(create_tray())
        .menu(create_window_menu())
        .on_system_tray_event(|app, event| system_tray_event_handler(app, &event))
        .on_window_event(|event| window_event_handler(&event))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

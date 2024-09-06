use tauri::{
    AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem,
};

pub fn create_tray() -> SystemTray {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide_or_show = CustomMenuItem::new("hide/show".to_string(), "Hide");
    let tray_menu = SystemTrayMenu::new()
        .add_item(hide_or_show)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);

    SystemTray::new().with_menu(tray_menu)
}

pub fn system_tray_event_handler(app: &AppHandle, event: &SystemTrayEvent) {
    match event {
        SystemTrayEvent::LeftClick {
            position: _,
            size: _,
            ..
        } => left_click_handler(app),
        SystemTrayEvent::RightClick {
            position: _,
            size: _,
            ..
        } => right_click_handler(app),
        SystemTrayEvent::MenuItemClick { id, .. } => menu_click_handler(app, id),
        _ => {}
    }
}

fn left_click_handler(app: &AppHandle) {
    let window = app.get_window("main").unwrap();
    window.show().unwrap();
    window.set_focus().unwrap();
}

fn right_click_handler(app: &AppHandle) {
    let window = app.get_window("main").unwrap();
    let is_visible = window.is_visible();
    let item_handle = app.tray_handle().get_item("hide/show");
    if is_visible.unwrap_or(false) {
        item_handle.set_title("Hide").unwrap();
    } else {
        item_handle.set_title("Show").unwrap();
    }
}

fn menu_click_handler(app: &AppHandle, id: &String) {
    match id.as_str() {
        "quit" => quit_handler(),
        "hide/show" => hide_or_show_handler(app),
        _ => {}
    }
}

fn quit_handler() {
    std::process::exit(0);
}

fn hide_or_show_handler(app: &AppHandle) {
    let window = app.get_window("main").unwrap();
    if window.is_visible().unwrap_or(false) {
        window.hide().unwrap();
    } else {
        window.show().unwrap();
        window.set_focus().unwrap();
    }
}

use tauri::{
    menu::{Menu, MenuEvent, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIcon, TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager, Wry,
};

pub fn create_tray(app: &AppHandle) -> tauri::Result<()> {
    let hide_or_show = MenuItem::with_id(app, "hide/show", "Hide", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&hide_or_show, &quit])?;

    let _ = TrayIconBuilder::with_id("tray")
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .menu_on_left_click(false)
        .on_menu_event(|app, event| menu_click_handler(app, event))
        .on_tray_icon_event(move |tray, event| system_tray_event_handler(tray, event, &menu))
        .build(app);

    Ok(())
}

fn system_tray_event_handler(tray: &TrayIcon, event: TrayIconEvent, menu: &Menu<Wry>) {
    match event {
        TrayIconEvent::Click {
            button: MouseButton::Left,
            button_state: MouseButtonState::Up,
            ..
        } => left_click_handler(tray),
        TrayIconEvent::Click {
            button: MouseButton::Right,
            button_state: MouseButtonState::Up,
            ..
        } => right_click_handler(tray, &menu),
        _ => {}
    }
}

fn left_click_handler(tray: &TrayIcon) {
    let app = tray.app_handle();
    if let Some(window) = app.get_webview_window("main") {
        window.show().unwrap();
        window.set_focus().unwrap();
    }
}

fn right_click_handler(tray: &TrayIcon, menu: &Menu<Wry>) {
    let app = tray.app_handle();
    let menu_item_generic = menu.get("hide/show").unwrap();
    let hide_or_show = menu_item_generic.as_menuitem().unwrap();
    if let Some(window) = app.get_webview_window("main") {
        let is_visible = window.is_visible();
        if is_visible.unwrap_or(false) {
            hide_or_show.set_text("Hide").unwrap();
        } else {
            hide_or_show.set_text("Show").unwrap();
        }
    }
}

fn menu_click_handler(app: &AppHandle, event: MenuEvent) {
    match event.id.as_ref() {
        "quit" => quit_handler(app),
        "hide/show" => hide_or_show_handler(app),
        _ => {}
    }
}

fn quit_handler(app: &AppHandle) {
    app.get_webview_window("main").unwrap().close().unwrap();
    app.exit(0);
}

fn hide_or_show_handler(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        if window.is_visible().unwrap_or(false) {
            window.hide().unwrap();
        } else {
            window.show().unwrap();
            window.set_focus().unwrap();
        }
    }
}

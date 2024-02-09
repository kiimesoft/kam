// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{CustomMenuItem, Manager, SystemTray};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_positioner::init())
        .system_tray(create_system_tray())
        // This is required to get tray-relative positions to work
        .on_system_tray_event(|app, event| {
            tauri_plugin_positioner::on_tray_event(app, &event);
            match event {
                tauri::SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                    "toggle" => {
                        let currently_visible =
                            app.get_window("main").unwrap().is_visible().unwrap();
                        app.emit_to("main", "toggle", currently_visible).unwrap();
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
                },
                tauri::SystemTrayEvent::LeftClick { .. } => {
                    let currently_visible = app.get_window("main").unwrap().is_visible().unwrap();
                    app.emit_to("main", "toggle", currently_visible).unwrap();
                }
                _ => {}
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn create_system_tray_menu() -> tauri::SystemTrayMenu {
    tauri::SystemTrayMenu::new()
        .add_item(CustomMenuItem::new(
            "toggle".to_string(),
            "Hide/Show Camera Preview",
        ))
        .add_item(CustomMenuItem::new("quit".to_string(), "Exit Kam"))
}

fn create_system_tray() -> SystemTray {
    SystemTray::new().with_menu(create_system_tray_menu())
}

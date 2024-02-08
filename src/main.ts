import { TauriEvent } from "@tauri-apps/api/event";
import { KamApp } from "./KamApp";
import "./services/settings-page-custom-element"
import { appWindow } from "@tauri-apps/api/window";

// Listen for the toggle tray event
appWindow.listen<boolean>("toggle", async (e) => {
  const isVisible = e.payload;

  if (isVisible) {
    await KamApp.stopApp();
  } else {
    await KamApp.runApp();
  }
})

appWindow.listen(TauriEvent.WINDOW_BLUR, KamApp.stopApp)

// disable native context menu
document.addEventListener("contextmenu", (e) => e.preventDefault());

// disable right click
document.addEventListener("mousedown", (e) => {
  if (e.button === 2) e.preventDefault();
});

// disable non native shortcuts
document.addEventListener("keydown", (e) => {
  // Page reload
  if (e.key === "F5" || (e.code === "KeyR" && e.ctrlKey)) {
    e.preventDefault();
  }

  // Open dev tools
  if (e.key === "F12" || (e.code === "KeyI" && e.ctrlKey)) {
    e.preventDefault();
  }
});

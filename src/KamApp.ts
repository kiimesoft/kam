import { moveWindow, Position } from "tauri-plugin-positioner-api";
import { appWindow, LogicalPosition } from "@tauri-apps/api/window";
import { displayAvailableCameras, displayVideoFromSelectedInput } from "./services/camera-selector";

export class KamApp {
    private static videoStream: MediaStream | null;
    private static $cameraSelector = document.querySelector("#select-camera") as HTMLSelectElement;
    private static $videoDisplayer = document.querySelector("#video") as HTMLVideoElement;

    static async runApp() {
        // Ensure the window is in the correct position
        await KamApp.moveWindowToBottomRight();
        await appWindow.show();
        await appWindow.setFocus();

        // Fill the camera selector with available cameras
        await displayAvailableCameras(KamApp.$cameraSelector);

        // Listen for camera selector changes
        KamApp.$cameraSelector.addEventListener("change", KamApp.onCameraSelectorChange);

        // Display the video from the selected input and store the stream
        KamApp.videoStream = await displayVideoFromSelectedInput(KamApp.$cameraSelector, KamApp.$videoDisplayer);
    }

    static async stopApp() {
        // hide the webview
        await appWindow.hide();

        // remove the camera selector listener to avoid memory leaks
        KamApp.$cameraSelector.removeEventListener("change", KamApp.onCameraSelectorChange);

        // stop the video stream
        if (KamApp.videoStream) {
            KamApp.videoStream.getTracks().forEach((track) => track.stop());
        }
    }

    private static onCameraSelectorChange() {
        displayVideoFromSelectedInput(KamApp.$cameraSelector, KamApp.$videoDisplayer);
    }

    private static async moveWindowToBottomRight() {
        await moveWindow(Position.BottomRight);
        const position = await appWindow.innerPosition();
        await appWindow.setPosition(new LogicalPosition(position.x - 18, position.y - 60));
    }


}

import { configureCameraSelector } from "./services/camera-selector";
import { takePhoto } from "./services/take-photo";
import "./services/settings-page-custom-element"

window.addEventListener("DOMContentLoaded", async () => {
  const $cameraSelector = document.querySelector("#select-camera") as HTMLSelectElement;
  const $videoDisplayer = document.querySelector("#video") as HTMLVideoElement;

  await configureCameraSelector($cameraSelector, $videoDisplayer);

  const $photoButton = document.querySelector("#button-take-photo") as HTMLButtonElement;
  $photoButton.addEventListener("click", () => { takePhoto($videoDisplayer) });

  const $settingsButton = document.querySelector("#button-settings") as HTMLButtonElement;
  $settingsButton.addEventListener("click", () => {
    const settingsPage = document.createElement("settings-page")

    document.body.appendChild(settingsPage)
  });
});




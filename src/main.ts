import { configureCameraSelector } from "./services/camera-selector";
import { takePhoto } from "./services/take-photo";

window.addEventListener("DOMContentLoaded", async () => {
  const $cameraSelector = document.querySelector("#select-camera") as HTMLSelectElement;
  const $videoDisplayer = document.querySelector("#video") as HTMLVideoElement;

  await configureCameraSelector($cameraSelector, $videoDisplayer);

  const $photoButton = document.querySelector("#button-take-photo") as HTMLButtonElement;
  $photoButton.addEventListener("click", () => { takePhoto($videoDisplayer) });
});




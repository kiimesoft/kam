import { writeBinaryFile } from "@tauri-apps/api/fs";
import { pictureDir } from "@tauri-apps/api/path";

async function getAvailableCameras() {
  const cameras = await navigator.mediaDevices.enumerateDevices();
  const videoCameras = cameras.filter((camera) => camera.kind === "videoinput");
  return videoCameras as InputDeviceInfo[];
}

async function displayCameraOptions($cameraSelector: HTMLSelectElement) {
  const cameras = await getAvailableCameras();

  // delete previous options
  while ($cameraSelector.firstChild) {
    $cameraSelector.removeChild($cameraSelector.firstChild);
  }

  cameras.forEach((camera) => {
    if (camera.kind === "videoinput") {
      const option = document.createElement("option");

      option.value = camera.deviceId;
      option.text = camera.label;

      $cameraSelector.appendChild(option);
    }
  });
}

async function displayVideoFromSelectedInput($cameraSelector: HTMLSelectElement, $videoDisplayer: HTMLVideoElement) {
  const cameras = await getAvailableCameras();
  const selectedCamera = cameras.find((camera) => camera.deviceId === $cameraSelector.value);

  if (!selectedCamera) {
    throw new Error("Selected camera not found");
  }

  // @ts-ignore - TS doesn't know about getCapabilities because it's not in the spec yet (but it's implemented in Chrome)
  const cameraCapabilities = selectedCamera.getCapabilities();

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      deviceId: selectedCamera.deviceId,
      width: cameraCapabilities.width.max,
      height: cameraCapabilities.height.max,
      frameRate: { exact: cameraCapabilities.frameRate.max }

    },
  });

  $videoDisplayer.srcObject = stream;
  $videoDisplayer.play();
}

window.addEventListener("DOMContentLoaded", async () => {
  // Display available cameras
  const $cameraSelector = document.querySelector("#select-camera") as HTMLSelectElement;
  const $videoDisplayer = document.querySelector("#video") as HTMLVideoElement;

  await displayCameraOptions($cameraSelector);

  // on change select camera, display video
  $cameraSelector.addEventListener("change", () => {
    displayVideoFromSelectedInput($cameraSelector, $videoDisplayer);
  });

  // Display video on load
  displayVideoFromSelectedInput($cameraSelector, $videoDisplayer);

  const $photoButton = document.querySelector("#take-photo") as HTMLButtonElement;
  $photoButton.addEventListener("click", () => {
    takePhoto($videoDisplayer);
  });
});


async function takePhoto($videoDisplayer: HTMLVideoElement) {
  $videoDisplayer.pause();

  const $canvas = document.createElement("canvas");
  $canvas.width = $videoDisplayer.videoWidth;
  $canvas.height = $videoDisplayer.videoHeight;

  $canvas.getContext("2d")?.drawImage($videoDisplayer, 0, 0, $canvas.width, $canvas.height);

  // create araybuffer from canvas

  $canvas.getContext("2d")?.drawImage($videoDisplayer, 0, 0, $canvas.width, $canvas.height);

  const pictureDire = await pictureDir();

  // create filename from date

  const filename = "kam-" + new Date().toISOString().replace(/:/g, "-") + ".png";


  $canvas.toBlob(async (blob) => {
    writeBinaryFile(`${pictureDire + filename}`, await blob?.arrayBuffer() as ArrayBuffer);
  });

  // delete created elements
  $canvas.remove();

  $videoDisplayer.play();

}

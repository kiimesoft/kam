async function getAvailableCameras() {
    const cameras = await navigator.mediaDevices.enumerateDevices();
    const videoCameras = cameras.filter((camera) => camera.kind === "videoinput");
    return videoCameras as InputDeviceInfo[];
}

async function displayAvailableCameras($cameraSelector: HTMLSelectElement) {
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

/**
 * Configures the camara selector HTML element and starts displaying the video from the selected camera.
 */
export async function configureCameraSelector($cameraSelector: HTMLSelectElement, $videoDisplayer: HTMLVideoElement) {
    await displayAvailableCameras($cameraSelector);

    // on change select camera, display video
    $cameraSelector.addEventListener("change", () => {
        displayVideoFromSelectedInput($cameraSelector, $videoDisplayer);
    });

    // Display video on load
    displayVideoFromSelectedInput($cameraSelector, $videoDisplayer);
}

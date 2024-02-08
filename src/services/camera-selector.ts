async function getAvailableCameras() {
    const cameras = await navigator.mediaDevices.enumerateDevices();
    const videoCameras = cameras.filter((camera) => camera.kind === "videoinput");
    return videoCameras as InputDeviceInfo[];
}

/**
 * Fills the given HTML select element with available cameras.
 * @param $cameraSelector HTML select element to fill with available cameras
 */
export async function displayAvailableCameras($cameraSelector: HTMLSelectElement) {
    const cameras = await getAvailableCameras();

    // delete previous options
    while ($cameraSelector.firstChild) {
        $cameraSelector.removeChild($cameraSelector.firstChild);
    }

    cameras.forEach((camera) => {
        const option = document.createElement("option");

        option.value = camera.deviceId;
        option.text = camera.label;

        $cameraSelector.appendChild(option);
    });
}

export async function displayVideoFromSelectedInput($cameraSelector: HTMLSelectElement, $videoDisplayer: HTMLVideoElement) {
    const cameras = await getAvailableCameras();
    const selectedCamera = cameras.find((camera) => camera.deviceId === $cameraSelector.value);

    if (!selectedCamera) {
        throw new Error("Selected camera not found");
    }

    const cameraCapabilities = selectedCamera.getCapabilities();

    const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            deviceId: selectedCamera.deviceId,
            width: cameraCapabilities?.width?.max,
            height: cameraCapabilities?.height?.max,
            frameRate: { exact: cameraCapabilities?.frameRate?.max }
        }
    });

    $videoDisplayer.srcObject = stream;
    $videoDisplayer.play();

    return stream;
}

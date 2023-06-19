
class SettingsPage extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' });

        const $container = this.createSettingsContainer()

        const $title = document.createElement("h1")
        $title.innerText = "Settings"
        $title.style.textAlign = "center"
        $container.appendChild($title)

        const $closeButton = document.createElement("button")
        $closeButton.innerText = "Close"
        $closeButton.addEventListener("click", this.closeSettingsPage)
        $container.appendChild($closeButton)


        const $mirrorVideoCheckbox = document.createElement("input")
        $mirrorVideoCheckbox.type = "checkbox"
        $mirrorVideoCheckbox.id = "mirror-video"
        $mirrorVideoCheckbox.addEventListener("change", () => {
            localStorage.setItem("mirrorVideo", $mirrorVideoCheckbox.checked.toString())
        })

        const $mirrorVideoLabel = document.createElement("label")
        $mirrorVideoLabel.innerText = "Mirror Video"
        $mirrorVideoLabel.htmlFor = "mirror-video"
        $mirrorVideoLabel.style.userSelect = "none"


        $container.appendChild($mirrorVideoCheckbox)
        $container.appendChild($mirrorVideoLabel)

        this.shadowRoot?.appendChild(this.createBlurBackground())
        this.shadowRoot?.appendChild($container)
    }

    private createBlurBackground() {
        const blurBackground = document.createElement("div")

        blurBackground.style.position = "fixed"
        blurBackground.style.top = "0"
        blurBackground.style.left = "0"
        blurBackground.style.width = "100%"
        blurBackground.style.height = "100%"
        blurBackground.style.backgroundColor = "rgba(0,0,0,0.5)"
        blurBackground.style.zIndex = "999"

        blurBackground.style.backdropFilter = "blur(5px)"

        return blurBackground
    }

    private createSettingsContainer() {
        const settingsContainer = document.createElement("div")

        settingsContainer.style.position = "fixed"
        settingsContainer.style.top = "50%"
        settingsContainer.style.left = "50%"
        settingsContainer.style.transform = "translate(-50%, -50%)"
        settingsContainer.style.width = "60%"
        settingsContainer.style.height = "70%"
        settingsContainer.style.borderRadius = "10px"
        settingsContainer.style.padding = "20px"

        settingsContainer.style.backgroundColor = "white"
        settingsContainer.style.zIndex = "1000"

        return settingsContainer
    }


    private closeSettingsPage() {
        document.querySelector("settings-page")?.remove()
    }
}

customElements.define('settings-page', SettingsPage);

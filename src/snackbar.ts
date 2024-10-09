const SNACKBAR_TYPES = {
    success: {
        // file: icons/check.svg
        iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>',
        backgroundColor: "darkgreen",
        color: "white",
    },
    error: {
        // file: icons/priority_high.svg
        iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M480-120q-33 0-56.5-23.5T400-200q0-33 23.5-56.5T480-280q33 0 56.5 23.5T560-200q0 33-23.5 56.5T480-120Zm-80-240v-480h160v480H400Z"/></svg>',
        backgroundColor: "darkred",
        color: "white",
    }
}

type SnackbarType = keyof typeof SNACKBAR_TYPES;

export class Snackbar {
    private container: HTMLElement;
    private iconContainer: HTMLElement;
    private text: HTMLSpanElement;
    private currentTimeout: number | null = null;

    constructor(container?: HTMLElement) {
        if (!container) {
            container = document.createElement("div");
            document.body.appendChild(container);
        }

        container.classList.add("snackbar");
        this.container = container;

        // create child elements
        this.iconContainer = document.createElement("div");
        this.text = document.createElement("span");

        this.container.appendChild(this.iconContainer);
        this.container.appendChild(this.text);
    }

    public show(type: SnackbarType, message: string, timeout = 3000) {
        const typeConfig = SNACKBAR_TYPES[type];

        // set text, icon and color
        this.text.textContent = message;
        this.container.style.backgroundColor = typeConfig.backgroundColor;
        this.container.style.color = typeConfig.color;

        this.iconContainer.innerHTML = typeConfig.iconSvg;
        this.iconContainer.style.fill = typeConfig.color;
        this.iconContainer.style.stroke = typeConfig.color;

        // show the snackbar
        this.container.classList.add("show");

        // hide after timeout
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
        }
        this.currentTimeout = setTimeout(() => this.container.classList.remove("show"), timeout);
    }
}
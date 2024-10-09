export class Snackbar {
    private container: HTMLElement;

    constructor(container?: HTMLElement) {
        if (!container) {
            container = document.createElement("div");
            document.body.appendChild(container);
        }

        container.classList.add("snackbar");
        this.container = container;
    }

    public show(message: string, timeout = 3000) {
        this.container.textContent = message;
        this.container.classList.add("show");
        setTimeout(() => this.container.classList.remove("show"), timeout);
    }
}
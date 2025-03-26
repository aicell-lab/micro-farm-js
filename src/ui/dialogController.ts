
export class DialogController {
    private dialog: HTMLElement | null;
    private dialogTitle: HTMLElement | null;
    private dialogMessage: HTMLElement | null;
    private dialogClose: HTMLElement | null;

    constructor() {
        this.dialog = document.getElementById("dialog");
        this.dialogTitle = document.getElementById("dialog-title");
        this.dialogMessage = document.getElementById("dialog-message");
        this.dialogClose = document.getElementById("dialog-close");
        this.dialogClose?.addEventListener("click", () => this.hideDialog());
    }

    public isDialogVisible(): boolean {
        return this.dialog !== null && !this.dialog.classList.contains("dialog-hidden");
    }

    public showOpticsDialog(opticsID: number): void {
       this.showDialog("Microscope Info", `Microscope #${opticsID}`)
    }

    private showDialog(title: string, message: string): void {
        if (this.dialog && this.dialogTitle && this.dialogMessage) {
            this.dialogTitle.textContent = title;
            this.dialogMessage.textContent = message;
            this.dialog.classList.remove("dialog-hidden");
        }
    }

    public hideDialog(): void {
        if (this.dialog) {
            this.dialog.classList.add("dialog-hidden");
        }
    }
}

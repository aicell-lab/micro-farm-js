
import { DialogController } from "../ctrl/dialogController";
import { DialogEvent, UIController } from "../ctrl/uiController";
import { Input } from "../io/input";

export class UIMediator {
    private uiController: UIController;
    private dialogController: DialogController;

    constructor(uiController: UIController, dialogController: DialogController) {
        this.uiController = uiController;
        this.dialogController = dialogController;
    }

    public update(input: Input): void {
        const dialog = this.dialogController;
        const ui = this.uiController;
        ui.update(input, dialog.isDialogVisible());
        if (ui.hasDialogEvent()) {
            this.handleDialogEvent(ui.getDialogEvent());
        }
    }

    private handleDialogEvent(event: DialogEvent): void {
        if (this.dialogController.isDialogVisible()) {
            this.dialogController.hideDialog();
        } else {
            this.dialogController.showOpticsDialog(event.opticsID);
        }
    }

}
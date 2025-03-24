
import { DialogController } from "../ctrl/dialogController";
import { UIController } from "../ctrl/uiController";
import { uiEventBus } from "../io/eventBus";
import { Input } from "../io/input";
import { DialogEvent } from "../io/uiEvent";
import { UIEventType } from "../setup/enums";

export class UIMediator {
    private uiController: UIController;
    private dialogController: DialogController;

    constructor(uiController: UIController, dialogController: DialogController) {
        this.uiController = uiController;
        this.dialogController = dialogController;

        uiEventBus.on(UIEventType.DialogToggle, (event: DialogEvent) => {
            this.handleDialogEvent(event);
        });
    }

    public update(input: Input): void {
        const dialog = this.dialogController;
        const ui = this.uiController;
        ui.update(input, dialog.isDialogVisible());
    }

    private handleDialogEvent(event: DialogEvent): void {
        if (this.dialogController.isDialogVisible()) {
            this.dialogController.hideDialog();
        } else {
            this.dialogController.showOpticsDialog(event.opticsID);
        }
    }

}
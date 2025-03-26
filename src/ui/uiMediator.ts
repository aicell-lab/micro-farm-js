
import { DialogController } from "./dialogController";
import { UIController } from "./uiController";
import { uiEventBus } from "../io/eventBus";
import { Input } from "../io/input";
import { DialogEvent } from "../io/uiEvent";
import { KeybindFlag, UIEventType } from "../setup/enums";
import { keybind } from "../io/keybind";

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
        keybind.bitFlag.syncState({ [KeybindFlag.DIALOG_VISIBLE]: this.dialogController.isDialogVisible() });
        const ui = this.uiController;
        ui.update(input);
    }

    private handleDialogEvent(event: DialogEvent): void {
        if (this.dialogController.isDialogVisible()) {
            this.dialogController.hideDialog();
        } else {
            this.dialogController.showOpticsDialog(event.opticsID);
        }
    }

}
import { KeyboardListener } from './keyboard';
import { Action } from '../types/action';
import { MovePayload, ActionPayload, RotatePayload } from '../types/actionType';
import { DashboardController } from '../system/dashboardController';
import { ArmCommand, Actions } from '../setup/enums';

export class InputListener {
    keyboardListener: KeyboardListener;
    dashboardController: DashboardController;

    constructor(dashboardController: DashboardController) {
        this.dashboardController = dashboardController;
        this.keyboardListener = new KeyboardListener();
    }

    getMoveAction(): Action {
        const dir: MovePayload = {
            forward: false,
            backward: false,
            left: false,
            right: false
        };

        const keys = this.keyboardListener.keyDown;
        if (keys["ArrowUp"] || keys["w"]) {
            dir.forward = true;
        }
        if (keys["ArrowDown"] || keys["s"]) {
            dir.backward = true;
        }
        if (keys["ArrowLeft"] || keys["a"]) {
            dir.left = true;
        }
        if (keys["ArrowRight"] || keys["d"]) {
            dir.right = true;
        }

        const actionPayload: ActionPayload = { type: Actions.PLAYER_MOVE, payload: dir };

        return new Action(actionPayload);
    }

    getRotateAction(): Action {
        const rot: RotatePayload = {
            left: false,
            right: false
        };

        const keys = this.keyboardListener.keyDown;
        if (keys["q"]) {
            rot.left = true;
        }
        if (keys["e"]) {
            rot.right = true;
        }

        const actionPayload: ActionPayload = { type: Actions.PLAYER_ROTATE, payload: rot };

        return new Action(actionPayload);
    }

    getPlayerActions(): Action[] {
        const actions: Action[] = [];
        actions.push(this.getMoveAction());
        actions.push(this.getRotateAction());
        return actions;
    }

    getArmCommands(): ArmCommand[] {
        return this.dashboardController.getAndClearQueue();
    }

}
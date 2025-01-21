import { KeyboardListener } from './keyboard';
import { Action } from '../types/action';
import { MovePayload, Actions, ActionPayload } from '../types/actionType';
import { InputKey } from '../types/keys';

export class InputListener {
    keyboardListener: KeyboardListener;

    constructor() {
        this.keyboardListener = new KeyboardListener();
    }

    getMoveAction(): Action {
        const dir: MovePayload = {
            forward: false,
            backward: false,
            left: false,
            right: false
        };

        const keys = this.keyboardListener.getKeyboardState();

        if (keys.isPressed(InputKey.ArrowUp)) {
            dir.forward = true;
        }
        if (keys.isPressed(InputKey.ArrowDown)) {
            dir.backward = true;
        }
        if (keys.isPressed(InputKey.ArrowLeft)) {
            dir.left = true;
        }
        if (keys.isPressed(InputKey.ArrowRight)) {
            dir.right = true;
        }
        const actionPayload: ActionPayload = { type: Actions.PLAYER_MOVE, payload: dir };

        return new Action(actionPayload);
    }

    getPlayerActions(): Action[] {
        const actions: Action[] = [];
        actions.push(this.getMoveAction());
        return actions;
    }

    getArmActions(): Action[] {
        const actions: Action[] = [];
        const target: ActionPayload = { type: Actions.ARM_BASE_MOVE, payload: { angle: -2.0 } };
        actions.push(new Action(target));
        return actions;
    }

}
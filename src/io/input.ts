import { KeyboardListener } from './keyboard';
import { Action } from '../types/action';
import { MovePayload, ActionType } from '../types/actionType';
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

        return new Action({ type: ActionType.MOVE, payload: dir });
    }

    getActions(): Action[] {
        const actions: Action[] = [];
        actions.push(this.getMoveAction());
        return actions;
    }

}
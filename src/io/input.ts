import { KeyboardListener } from './keyboard';
import { Action } from '../types/action';
import { MovePayload, ActionType, ActionPayload } from '../types/actionType';
import { InputKey } from '../types/keys';

export class InputListener {
    keyboardListener: KeyboardListener;

    constructor() {
        this.keyboardListener = new KeyboardListener();
    }

    getAction(): Action {
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

        const payload = {
            type: ActionType.MOVE,
            payload: dir
        }

        return new Action(payload);
    }

}
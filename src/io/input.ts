import { KeyboardListener } from './keyboard';
import { Action, MoveAction } from '../types/action';
import { InputKey } from '../types/keys';

export class InputListener {
    keyboardListener: KeyboardListener;

    constructor() {
        this.keyboardListener = new KeyboardListener();
    }

    getAction(): Action {
        let dir = { forward: false, backward: false, left: false, right: false };

        let keys = this.keyboardListener.getKeyboardState();
        if (keys.isPressed(InputKey.ArrowUp)) {
            dir.forward = true;
        } else if (keys.isPressed(InputKey.ArrowDown)) {
            dir.backward = true;
        }
        if (keys.isPressed(InputKey.ArrowLeft)) {
            dir.left = true;
        } else if (keys.isPressed(InputKey.ArrowRight)) {
            dir.right = true;
        }

        return new MoveAction(dir);
    }

}
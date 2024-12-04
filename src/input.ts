import { InputKey, KeyboardListener, KeyboardState } from './keyboard';
import { Action, Move } from './action';

export class InputListener {
    keyboardListener: KeyboardListener;

    constructor() {
        this.keyboardListener = new KeyboardListener();
    }

    getAction(): Action {
        let move: Move = { forward: false, backward: false, left: false, right: false };

        let keys = this.keyboardListener.getKeyboardState();
        if (keys.isPressed(InputKey.ArrowUp)) {
            move.forward = true;
        } else if (keys.isPressed(InputKey.ArrowDown)) {
            move.backward = true;
        }
        if (keys.isPressed(InputKey.ArrowLeft)) {
            move.left = true;
        } else if (keys.isPressed(InputKey.ArrowRight)) {
            move.right = true;
        }

        let action: Action = { move };
        return action;
    }

}
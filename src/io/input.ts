import { KeyboardInput, KeyboardListener } from './keyboard';
import { MouseInput, MouseListener } from './mouse';
import { requestPointerLock, exitPointerLock } from '../system/window';

export interface Input {
    keys: KeyboardInput;
    mouse: MouseInput;
}

export class InputListener {
    private keyboardListener: KeyboardListener;
    private mouseListener: MouseListener;

    constructor() {
        this.keyboardListener = new KeyboardListener();
        this.mouseListener = new MouseListener();
    }

    private getKeyboardInput(): KeyboardInput {
        return this.keyboardListener.getKeyboardInput();
    }

    private getMouseInput(): MouseInput {
        return this.mouseListener.getMouseInput();
    }

    public getInput(): Input {
        return { keys: this.getKeyboardInput(), mouse: this.getMouseInput() };
    }

}

export function togglePointerLock(input: Input): void {
    const locked = input.mouse.pointerLocked;
    const lockKey = "r";
    if (!locked && input.keys.pressed.has(lockKey)) {
        requestPointerLock();
    }
    else if (locked && input.keys.pressed.has(lockKey)) {
        exitPointerLock();
    }
}

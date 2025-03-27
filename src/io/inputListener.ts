import { KeyboardInput, KeyboardListener } from './keyboard';
import { MouseInput, MouseListener } from './mouse';
import { requestPointerLock, exitPointerLock } from '../system/window';
import { keybind, KeybindBitFlag } from './keybind';
import { Input } from './input';

function registerPointerLockToggle() {
    keybind.register("r", (input: Input, _flag: KeybindBitFlag) => {
        input.mouse.pointerLocked ? exitPointerLock() : requestPointerLock()
    });
}

export class InputListener {
    private keyboardListener: KeyboardListener;
    private mouseListener: MouseListener;

    constructor() {
        this.keyboardListener = new KeyboardListener();
        this.mouseListener = new MouseListener();

        registerPointerLockToggle();
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


import { KeyboardInput, KeyboardListener } from './keyboard';
import { MouseInput, MouseListener } from './mouse';

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

    public requestPointerLock(): void {
        const canvas = document.body;
        if (canvas.requestPointerLock) {
            canvas.requestPointerLock();
        }
    }

    public exitPointerLock() {
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }
    }

}

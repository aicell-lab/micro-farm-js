import { KeyboardInput, KeyboardListener } from './keyboard';
import { MouseInput, MouseListener } from './mouse';

export class InputListener {
    private keyboardListener: KeyboardListener;
    private mouseListener: MouseListener;

    constructor() {
        this.keyboardListener = new KeyboardListener();
        this.mouseListener = new MouseListener();
    }

    public getKeyboardInput(): KeyboardInput {
        return this.keyboardListener.getKeyboardInput();
    }

    public getMouseInput(): MouseInput {
        return this.mouseListener.getMouseInput();
    }

}

import { InputKey } from "../types/keys";

export class KeyboardState {
    private keys: { [key in InputKey]?: boolean };

    constructor(keys: { [key in InputKey]?: boolean }) {
        this.keys = { ...keys };
    }

    isPressed(key: InputKey | InputKey[]): boolean {
        if (Array.isArray(key)) {
            return this.isAnyPressed(key);
        } else {
            return !!this.keys[key];
        }
    }

    private isAnyPressed(keys: InputKey[]): boolean {
        return keys.some(k => !!this.keys[k]);
    }
}

export class KeyboardListener {
    private keys: { [key in InputKey]?: boolean } = {};

    constructor() {
        window.addEventListener('keydown', (event) => this.onKeyDown(event));
        window.addEventListener('keyup', (event) => this.onKeyUp(event));
    }

    private onKeyDown(event: KeyboardEvent) {
        if (event.key in InputKey) {
            this.keys[event.key as InputKey] = true;
        }
    }

    private onKeyUp(event: KeyboardEvent) {
        if (event.key in InputKey) {
            this.keys[event.key as InputKey] = false;
        }
    }

    getKeyboardState(): KeyboardState {
        return new KeyboardState(this.keys);
    }

}
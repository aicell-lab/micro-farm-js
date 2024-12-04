
export enum InputKey {
    ArrowUp = 'ArrowUp',
    ArrowDown = 'ArrowDown',
    ArrowLeft = 'ArrowLeft',
    ArrowRight = 'ArrowRight',
    Space = 'Space',
    W = 'w',
    A = 'a',
    S = 's',
    D = 'd',
}

export class KeyboardState {
    private keys: { [key in InputKey]?: boolean };

    constructor(keys: { [key in InputKey]?: boolean }) {
        this.keys = { ...keys };
    }

    isPressed(key: InputKey): boolean {
        return !!this.keys[key];
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

export interface KeyboardInput {
    pressed: Set<string>;
    released: Set<string>;
    held: Set<string>;
}


export class KeyboardListener {
    private keyboardInput: KeyboardInput = {
        pressed: new Set(),
        released: new Set(),
        held: new Set(),
    };

    constructor() {
        window.addEventListener("keydown", this.onKeyDown.bind(this));
        window.addEventListener("keyup", this.onKeyUp.bind(this));
    }

    private onKeyDown(event: KeyboardEvent) {
        if (!this.keyboardInput.held.has(event.key)) {
            this.keyboardInput.pressed.add(event.key); // Mark as newly pressed
        }
        this.keyboardInput.held.add(event.key); // Mark as held
    }

    private onKeyUp(event: KeyboardEvent) {
        this.keyboardInput.held.delete(event.key);
        this.keyboardInput.pressed.delete(event.key);
        this.keyboardInput.released.add(event.key);
    }

    public getKeyboardInput(): KeyboardInput {
        return {
            pressed: new Set(this.keyboardInput.pressed),
            released: new Set(this.keyboardInput.released),
            held: new Set(this.keyboardInput.held),
        };
    }

    public clear(): void {
        this.keyboardInput.pressed.clear();
        this.keyboardInput.released.clear();
    }

}

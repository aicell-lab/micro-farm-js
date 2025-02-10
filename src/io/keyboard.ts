
export class KeyboardListener {
    public keyDown: { [key: string]: boolean };

    constructor() {
        window.addEventListener('keydown', (event) => this.onKeyDown(event));
        window.addEventListener('keyup', (event) => this.onKeyUp(event));
        this.keyDown = {
            'ArrowUp': false,
            'ArrowDown': false,
            'ArrowLeft': false,
            'ArrowRight': false,
            ' ': false,
            'w': false
        };

    }

    private onKeyDown(event: KeyboardEvent) {
        this.keyDown[event.key] = true;
    }

    private onKeyUp(event: KeyboardEvent) {
        this.keyDown[event.key] = false;
    }


}
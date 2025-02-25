import { MouseButton } from "../setup/enums";

export interface MouseInput {
    x: number;
    y: number;
    pressed: Set<MouseButton>;
    released: Set<MouseButton>;
    held: Set<MouseButton>;
}

export class MouseListener {
    private mouseInput: MouseInput = {
        x: 0,
        y: 0,
        pressed: new Set(),
        released: new Set(),
        held: new Set(),
    };

    constructor() {
        document.addEventListener("mousemove", this.onMouseMove.bind(this));
        document.addEventListener("mousedown", this.onMouseDown.bind(this));
        document.addEventListener("mouseup", this.onMouseUp.bind(this));
    }

    private onMouseMove(event: MouseEvent) {
        this.mouseInput.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseInput.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    private onMouseDown(event: MouseEvent) {
        const button = event.button as MouseButton;
        if (!this.mouseInput.held.has(button)) {
            this.mouseInput.pressed.add(button);
        }
        this.mouseInput.held.add(button);
    }

    private onMouseUp(event: MouseEvent) {
        const button = event.button as MouseButton;
        this.mouseInput.held.delete(button);
        this.mouseInput.pressed.delete(button);
        this.mouseInput.released.add(button);
    }

    public getMouseInput(): MouseInput {
        return {
            x: this.mouseInput.x,
            y: this.mouseInput.y,
            pressed: new Set(this.mouseInput.pressed),
            released: new Set(this.mouseInput.released),
            held: new Set(this.mouseInput.held)
        };
    }
}
import * as THREE from 'three';
import { MouseButton } from "../setup/enums";

export interface MouseInput {
    x: number;
    y: number;
    dx: number;
    dy: number;
    scrollDelta: number;
    normalizedScrollDelta: number;
    pressed: Set<MouseButton>;
    released: Set<MouseButton>;
    held: Set<MouseButton>;
    pointerLocked: boolean;
}

export class MouseListener {
    private mouseInput: MouseInput = {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        scrollDelta: 0,
        normalizedScrollDelta: 0,
        pressed: new Set(),
        released: new Set(),
        held: new Set(),
        pointerLocked: false,
    };

    private lastX: number = 0;
    private lastY: number = 0;
    private initialized: boolean = false;

    constructor() {
        document.addEventListener("mousemove", this.onMouseMove.bind(this));
        document.addEventListener("mousedown", this.onMouseDown.bind(this));
        document.addEventListener("mouseup", this.onMouseUp.bind(this));
        document.addEventListener("wheel", this.onMouseScroll.bind(this));
        document.addEventListener("pointerlockchange", this.onPointerLockChange.bind(this));
    }

    private onPointerLockChange() {
        this.mouseInput.pointerLocked = document.pointerLockElement === document.body;
        if (document.pointerLockElement !== document.body) {
            console.log("Pointer lock lost");
        } else {
            console.log("Pointer locked");
        }
    }

    private onMouseScroll(event: WheelEvent) {
        const MAX_SCROLL_DELTA = 300;
        this.mouseInput.scrollDelta = event.deltaY;
        this.mouseInput.normalizedScrollDelta = THREE.MathUtils.clamp(event.deltaY / MAX_SCROLL_DELTA, -1, 1);
    }

    private onMouseMove(event: MouseEvent) {
        if (document.pointerLockElement) {
            const sensitivity = 0.01;
            this.mouseInput.dx = event.movementX * sensitivity;
            this.mouseInput.dy = event.movementY * sensitivity;
        } else {
            const normX = (event.clientX / window.innerWidth) * 2 - 1;
            const normY = -(event.clientY / window.innerHeight) * 2 + 1;
            if (!this.initialized) {
                this.lastX = normX;
                this.lastY = normY;
                this.initialized = true;
            }
            this.mouseInput.dx = normX - this.lastX;
            this.mouseInput.dy = normY - this.lastY;
            this.mouseInput.x = normX;
            this.mouseInput.y = normY;
            this.lastX = normX;
            this.lastY = normY;
        }
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

    private clear(): void {
        this.mouseInput.pressed.clear();
        this.mouseInput.released.clear();
        this.mouseInput.scrollDelta = 0;
        this.mouseInput.normalizedScrollDelta = 0;
    }

    public getMouseInput(): MouseInput {
        const inputSnapshot = {
            x: this.mouseInput.x,
            y: this.mouseInput.y,
            dx: this.mouseInput.dx,
            dy: this.mouseInput.dy,
            scrollDelta: this.mouseInput.scrollDelta,
            normalizedScrollDelta: this.mouseInput.normalizedScrollDelta,
            pressed: new Set(this.mouseInput.pressed),
            released: new Set(this.mouseInput.released),
            held: new Set(this.mouseInput.held),
            pointerLocked: this.mouseInput.pointerLocked,
        };
        this.clear();
        return inputSnapshot;
    }
}
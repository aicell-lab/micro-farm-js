import * as THREE from 'three';
import { InputKey, KeyboardState } from './keyboard';

export class Actor {
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    acceleration: THREE.Vector3;

    constructor() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.mesh = new THREE.Mesh(geometry, material);

        this.velocity = new THREE.Vector3();
        this.acceleration = new THREE.Vector3();
    }

    applyInput(input: KeyboardState) {
        if (input.isPressed(InputKey.ArrowUp)) {
            this.acceleration.z = -2;
        } else if (input.isPressed(InputKey.ArrowDown)) {
            this.acceleration.z = 2;
        } else {
            this.acceleration.z = 0;
        }
        if (input.isPressed(InputKey.ArrowLeft)) {
            this.acceleration.x = -2;
        } else if (input.isPressed(InputKey.ArrowRight)) {
            this.acceleration.x = 2;
        } else {
            this.acceleration.x = 0;
        }
    }

    update(delta: number) {
        this.updatePosition(delta);
    }

    updatePosition(delta: number) {
        this.velocity.add(this.acceleration.clone().multiplyScalar(delta));
        this.mesh.position.add(this.velocity.clone().multiplyScalar(delta));
        this.velocity.multiplyScalar(0.95);
    }

}


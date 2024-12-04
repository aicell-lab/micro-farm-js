import * as THREE from 'three';
import { Action, Move } from './action';

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

    private applyMove(move: Move) {
        let acc = 5;

        if (move.forward) {
            this.acceleration.z = -acc;
        } else if (move.backward) {
            this.acceleration.z = acc;
        } else {
            this.acceleration.z = 0;
        }
        if (move.left) {
            this.acceleration.x = -acc;
        } else if (move.right) {
            this.acceleration.x = acc;
        } else {
            this.acceleration.x = 0;
        }
    }

    applyAction(action: Action) {
        this.applyMove(action.move);
    }

    update(delta: number) {
        this.updatePosition(delta);
    }

    private updatePosition(delta: number) {
        this.velocity.add(this.acceleration.clone().multiplyScalar(delta));
        this.mesh.position.add(this.velocity.clone().multiplyScalar(delta));
        this.velocity.multiplyScalar(0.95);
    }

}


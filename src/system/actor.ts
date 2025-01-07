import * as THREE from 'three';
import { Action, Move } from '../types/action';

export class Actor {
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    acceleration: THREE.Vector3;

    constructor() {
        const geometry = new THREE.BoxGeometry(0.5, 1.0, 0.5);
        const material = new THREE.MeshBasicMaterial({ color: 0x008822 });
        this.mesh = new THREE.Mesh(geometry, material);

        const edges = new THREE.EdgesGeometry(geometry);
        const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x222222 });
        const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
        this.mesh.add(edgeLines);

        this.velocity = new THREE.Vector3();
        this.acceleration = new THREE.Vector3();
    }

    private applyMove(move: Move) {
        let acc = 10;

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

        const dampingFactor = 1 - Math.min(1, 5 * delta);
        this.velocity.multiplyScalar(dampingFactor);
        const velocityThreshold = 0.01;
        if (this.velocity.lengthSq() < velocityThreshold * velocityThreshold) {
            this.velocity.set(0, 0, 0);
        }
    }

}


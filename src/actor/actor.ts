import * as THREE from 'three';
import { MovePayload } from '../types/actionType';

export function createDefaultActorMesh(): THREE.Object3D {
    let object = new THREE.Object3D();
    const geometry = new THREE.BoxGeometry(0.5, 1.0, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: 0x008822 });
    let mesh = new THREE.Mesh(geometry, material);

    const edges = new THREE.EdgesGeometry(geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x222222 });
    const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
    mesh.add(edgeLines);
    object.add(mesh);
    return object;
}

export abstract class Actor {
    object: THREE.Object3D;
    velocity: THREE.Vector3;
    acceleration: THREE.Vector3;

    constructor(object: THREE.Object3D) {
        this.velocity = new THREE.Vector3();
        this.acceleration = new THREE.Vector3();
        this.object = object;
    }

    update(delta: number) {
        this.updatePosition(delta);
    }

    private updatePosition(delta: number) {
        this.velocity.add(this.acceleration.clone().multiplyScalar(delta));
        this.object.position.add(this.velocity.clone().multiplyScalar(delta));

        const dampingFactor = 1 - Math.min(1, 5 * delta);
        this.velocity.multiplyScalar(dampingFactor);
        const velocityThreshold = 0.01;
        if (this.velocity.lengthSq() < velocityThreshold * velocityThreshold) {
            this.velocity.set(0, 0, 0);
        }
    }

    abstract handleMove(payload: MovePayload): void;

}





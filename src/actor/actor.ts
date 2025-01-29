import * as THREE from 'three';
import { MovePayload } from '../types/actionType';
import { MeshStandardMaterial } from 'three';

function createDefaultMaterial(): MeshStandardMaterial {
    const material = new MeshStandardMaterial({
        color: 0x008822,
        metalness: 0.3,
        roughness: 0.7
    });
    return material;
}

export function createDefaultActorMesh(): THREE.Object3D {
    let object = new THREE.Object3D();
    const geometry = new THREE.BoxGeometry(0.5, 1.0, 0.5);
    const material = createDefaultMaterial();
    let mesh = new THREE.Mesh(geometry, material);

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

    protected updatePosition(delta: number) {
        this.velocity.add(this.acceleration.clone().multiplyScalar(delta));
        this.object.position.add(this.velocity.clone().multiplyScalar(delta));

        const dampingFactor = 1 - Math.min(1, 5 * delta);
        this.velocity.multiplyScalar(dampingFactor);
        const velocityThreshold = 0.01;
        if (this.velocity.lengthSq() < velocityThreshold * velocityThreshold) {
            this.velocity.set(0, 0, 0);
        }
    }


    abstract update(delta: number): void;
    abstract handleMove(payload: MovePayload): void;

}





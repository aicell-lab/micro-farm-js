import * as THREE from 'three';
import { MeshStandardMaterial } from 'three';
import { PlayerController } from './playerController';

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
    playerController?: PlayerController;

    constructor(object: THREE.Object3D) {
        this.object = object;
    }

    abstract update(delta: number): void;

}





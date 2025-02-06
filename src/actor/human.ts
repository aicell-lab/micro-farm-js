import { Actor } from './actor';
import { PlayerController } from './playerController';
import * as THREE from 'three';
import { MeshStandardMaterial } from 'three';

function createDefaultMaterial(): MeshStandardMaterial {
    const material = new MeshStandardMaterial({
        color: 0x008822,
        metalness: 0.3,
        roughness: 0.7
    });
    return material;
}

function createDefaultActorMesh(): THREE.Object3D {
    let object = new THREE.Object3D();
    const geometry = new THREE.BoxGeometry(0.5, 1.0, 0.5);
    const material = createDefaultMaterial();
    let mesh = new THREE.Mesh(geometry, material);

    object.add(mesh);
    return object;
}

export class Human extends Actor {

    constructor() {
        super(createDefaultActorMesh());
        this.playerController = new PlayerController();
    }

    update(delta: number): void {
        this.playerController?.update(this.object, delta);
    }
}



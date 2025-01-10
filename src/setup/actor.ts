import * as THREE from 'three';
import { MovePayload } from '../types/actionType';

function createDefaultActorMesh(): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(0.5, 1.0, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: 0x008822 });
    let mesh = new THREE.Mesh(geometry, material);

    const edges = new THREE.EdgesGeometry(geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x222222 });
    const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
    mesh.add(edgeLines);
    return mesh;
}

export abstract class Actor {
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    acceleration: THREE.Vector3;

    constructor(mesh: THREE.Mesh) {
        this.velocity = new THREE.Vector3();
        this.acceleration = new THREE.Vector3();
        this.mesh = mesh;
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

    abstract handleMove(payload: MovePayload): void;

}

export class Human extends Actor {

    constructor() {
        super(createDefaultActorMesh());
    }

    handleMove(p: MovePayload): void {
        const acc = 10;
        if (p.forward) this.acceleration.z = -acc;
        else if (p.backward) this.acceleration.z = acc;
        else this.acceleration.z = 0;

        if (p.left) this.acceleration.x = -acc;
        else if (p.right) this.acceleration.x = acc;
        else this.acceleration.x = 0;
    }
}

export interface RoomActors {
    player: Human;

}

import * as THREE from 'three';
import { MovePayload } from '../types/actionType';

// Player Kinematic State (Unrealistic physics)
interface PKinematicState {
    velocity: THREE.Vector3;
    acceleration: THREE.Vector3;
}

export class PlayerController {
    private kinState: PKinematicState;

    constructor() {
        this.kinState = { velocity: new THREE.Vector3(), acceleration: new THREE.Vector3() };
    }

    public update(object: THREE.Object3D, delta: number) {
        if (this.kinState) {
            const { acceleration: a, velocity: v } = this.kinState;
            v.add(a.clone().multiplyScalar(delta));
            object.position.add(v.clone().multiplyScalar(delta));

            const dampingFactor = 1 - Math.min(1, 5 * delta);
            v.multiplyScalar(dampingFactor);
            const velocityThreshold = 0.01;
            if (v.lengthSq() < velocityThreshold ** 2) {
                v.set(0, 0, 0);
            }
        }
    }

    public handleMove(p: MovePayload) {
        let a = this.kinState.acceleration;
        const acc = 10;
        if (p.forward) a.z = -acc;
        else if (p.backward) a.z = acc;
        else a.z = 0;

        if (p.left) a.x = -acc;
        else if (p.right) a.x = acc;
        else a.x = 0;
    }
}
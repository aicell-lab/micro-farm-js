import * as THREE from 'three';
import { MovePayload, RotatePayload } from '../types/actionType';

// Player Kinematic State (Unrealistic physics)
interface PKinematicState {
    velocity: THREE.Vector3;
    acceleration: THREE.Vector3;
}

export class PlayerController {
    private kinState: PKinematicState;
    private rotationSpeed: number;

    constructor() {
        this.kinState = { velocity: new THREE.Vector3(), acceleration: new THREE.Vector3() };
        this.rotationSpeed = 0.00;
    }


    public update(object: THREE.Object3D, delta: number) {
        if (this.kinState) {
            const { acceleration: a, velocity: v } = this.kinState;

            const forwardDirection = new THREE.Vector3(0, 0, 1);
            object.getWorldDirection(forwardDirection);

            const rightDirection = new THREE.Vector3();
            rightDirection.crossVectors(new THREE.Vector3(0, 1, 0), forwardDirection).normalize();

            const acc = 0.025;
            if (a.z !== 0) {
                v.add(forwardDirection.clone().multiplyScalar(a.z * acc));
            }
            if (a.x !== 0) {
                v.add(rightDirection.clone().multiplyScalar(a.x * acc));
            }

            object.position.add(v.clone().multiplyScalar(delta));

            const dampingFactor = 1 - Math.min(1, 5 * delta);
            v.multiplyScalar(dampingFactor);

            const velocityThreshold = 0.01;
            if (v.lengthSq() < velocityThreshold ** 2) {
                v.set(0, 0, 0);
            }
        }

        object.rotation.y += this.rotationSpeed * delta;
    }

    public handleMove(p: MovePayload) {

        let a = this.kinState.acceleration;
        const acc = 10;
        if (p.forward) a.z = acc;
        else if (p.backward) a.z = -acc;
        else a.z = 0;

        if (p.left) a.x = acc;
        else if (p.right) a.x = -acc;
        else a.x = 0;

    }

    public handleRotation(p: RotatePayload) {
        this.rotationSpeed = 0.0;
        const speed = 2.0;

        if (p.left) {
            this.rotationSpeed = -speed;
        }
        if (p.right) {
            this.rotationSpeed = speed;
        }
    }
}
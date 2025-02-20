import * as THREE from 'three';
import { MovePayload, RotatePayload } from '../types/actionType';
import { Entity } from './entity';

// Player Kinematic State (Unrealistic physics)
interface PKinematicState {
    velocity: THREE.Vector3;
    acceleration: THREE.Vector3;
}

class PlayerPhysicsController {
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

        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationSpeed * delta);
        object.quaternion.multiplyQuaternions(quaternion, object.quaternion);
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
            this.rotationSpeed = speed;
        }
        if (p.right) {
            this.rotationSpeed = -speed;
        }
    }

    public getVelocity(): THREE.Vector3 {
        return this.kinState.velocity.clone();
    }

    public getRelativeVelocity(object: THREE.Object3D): THREE.Vector3 {
        return object.worldToLocal(this.kinState.velocity.clone().add(object.position));
    }
}


class PlayerAnimationController {

    private animationMixer: THREE.AnimationMixer;
    private object: THREE.Object3D;
    private animations: THREE.AnimationClip[];
    private walkAction: THREE.AnimationAction;
    private physicsCtrl: PlayerPhysicsController;

    constructor(entity: Entity, phyicsCtrl: PlayerPhysicsController) {
        this.object = entity.object;
        this.animations = entity.animations!;
        this.animationMixer = new THREE.AnimationMixer(this.object);
        this.walkAction = this.animationMixer.clipAction(this.animations[0]); //Assume first animation is walk
        this.walkAction.play();
        this.walkAction.paused = true;
        this.physicsCtrl = phyicsCtrl;
    }

    public update(dt: number): void {
        const velocity = this.physicsCtrl.getVelocity();
        const speed = velocity.length();
        const localVelocity = this.physicsCtrl.getRelativeVelocity(this.object);

        if (speed > 0.01) {
            this.walkAction.paused = false;
            let timeScale = Math.min(2.0, speed * 0.5);
            if (localVelocity.z < 0) {
                timeScale = timeScale * -1.0;
            }
            this.walkAction.timeScale = timeScale;
        } else {
            this.walkAction.paused = true;
        }

        this.animationMixer.update(dt);
    }
}

export class PlayerController {
    private phyicsCtrl: PlayerPhysicsController;
    private animationCtrl: PlayerAnimationController;

    constructor(entity: Entity) {
        this.phyicsCtrl = new PlayerPhysicsController();
        this.animationCtrl = new PlayerAnimationController(entity, this.phyicsCtrl);
    }

    public update(object: THREE.Object3D, dt: number) {
        this.phyicsCtrl.update(object, dt);
        this.animationCtrl.update(dt);
    }

    public handleMove(p: MovePayload) {
        this.phyicsCtrl.handleMove(p);
    }

    public handleRotation(p: RotatePayload) {
        this.phyicsCtrl.handleRotation(p);
    }

}
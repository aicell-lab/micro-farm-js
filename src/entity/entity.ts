import * as THREE from 'three';
import { PlayerController } from './playerController';
import { ArmController } from './armController';
import { PhysicsController } from './physicsController';

export interface EntityOptions {
    object: THREE.Object3D;
    playerController?: PlayerController;
    armController?: ArmController;
    physicsController?: PhysicsController;
}

export class Entity {
    object: THREE.Object3D;
    playerController?: PlayerController;
    armController?: ArmController;
    physicsController?: PhysicsController;

    constructor({ object, playerController, armController, physicsController }: EntityOptions) {
        this.object = object;
        this.playerController = playerController;
        this.armController = armController;
        this.physicsController = physicsController;
    }

    public update(delta: number): void {
        this.playerController?.update(this.object, delta);
        this.armController?.update(delta);
    }

}





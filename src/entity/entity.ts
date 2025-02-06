import * as THREE from 'three';
import { PlayerController } from './playerController';
import { ArmController } from './armController';
import { PhysicsController } from './physicsController';

export class Entity {
    object: THREE.Object3D;
    playerController?: PlayerController;
    armController?: ArmController;
    physicsController?: PhysicsController;

    constructor(object: THREE.Object3D, playerController?: PlayerController, armController?: ArmController, physicsController?: PhysicsController) {
        this.object = object;
        this.playerController = playerController;
        this.armController = armController;
        this.physicsController = physicsController;
    }

    public update(delta: number): void {
        if (this.playerController) {
            this.playerController.update(this.object, delta);
        }
        if (this.armController) {
            this.armController.update(delta);
        }
    }

}





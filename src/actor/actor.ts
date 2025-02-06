import * as THREE from 'three';
import { PlayerController } from './playerController';
import { ArmController } from './armController';

export class Actor {
    object: THREE.Object3D;
    playerController?: PlayerController;
    armController?: ArmController;

    constructor(object: THREE.Object3D, playerController?: PlayerController, armController?: ArmController) {
        this.object = object;
        this.playerController = playerController;
        this.armController = armController;
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





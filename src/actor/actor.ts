import * as THREE from 'three';
import { PlayerController } from './playerController';

export abstract class Actor {
    object: THREE.Object3D;
    playerController?: PlayerController;

    constructor(object: THREE.Object3D) {
        this.object = object;
    }

    abstract update(delta: number): void;

}





import * as THREE from 'three';
import { PhysicsController } from './physicsController';

export abstract class RoomObject {
    object: THREE.Object3D;
    physicsController?: PhysicsController;

    constructor(object: THREE.Object3D, physicsController?: PhysicsController) {
        this.object = object;
        this.physicsController = physicsController;
    }
}


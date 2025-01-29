import * as THREE from 'three';

export abstract class RoomObject {
    object: THREE.Object3D;

    constructor(object: THREE.Object3D) {
        this.object = object;
    }
}


import * as THREE from 'three';
import { PhysicsController } from './physicsController';
import { Bubble } from './bubble';

export interface EntityOptions {
    object: THREE.Object3D;
    physicsController?: PhysicsController;
    animations?: THREE.AnimationClip[];
}

export class Entity {
    object: THREE.Object3D;
    animations?: THREE.AnimationClip[];
    physicsController?: PhysicsController;
    bubbles: Bubble[];

    constructor({ object, physicsController, animations }: EntityOptions) {
        this.bubbles = [];
        this.object = object;
        this.physicsController = physicsController;
        this.animations = animations;
    }

}





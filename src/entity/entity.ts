import * as THREE from 'three';
import { Bubble } from './bubble';

export interface EntityOptions {
    object: THREE.Object3D;
    animations?: THREE.AnimationClip[];
}

export class Entity {
    object: THREE.Object3D;
    animations?: THREE.AnimationClip[];
    bubbles: Bubble[];

    constructor({ object, animations }: EntityOptions) {
        this.bubbles = [];
        this.object = object;
        this.animations = animations;
    }

}





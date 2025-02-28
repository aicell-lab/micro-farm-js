import * as THREE from 'three';
import { Bubble } from './bubble';
import { SelectBox } from './selectBox';

export interface EntityOptions {
    object: THREE.Object3D;
    animations?: THREE.AnimationClip[];
}

export class Entity {
    object: THREE.Object3D;
    bubbles: Bubble[];
    selectBoxes: SelectBox[];

    constructor({ object, animations }: EntityOptions) {
        this.bubbles = [];
        this.selectBoxes = [];
        this.object = object;
        this.object.animations = animations ?? [];
    }

}





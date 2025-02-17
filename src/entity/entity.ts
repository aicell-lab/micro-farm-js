import * as THREE from 'three';
import { PhysicsController } from './physicsController';
export interface EntityOptions {
    object: THREE.Object3D;
    physicsController?: PhysicsController;
    animations?: THREE.AnimationClip[];
}

export class Entity {
    object: THREE.Object3D;
    animations?: THREE.AnimationClip[];
    physicsController?: PhysicsController;
    bubbles: THREE.Mesh[];

    constructor({ object, physicsController, animations }: EntityOptions) {
        this.bubbles = [];
        this.object = object;
        this.physicsController = physicsController;
        this.animations = animations;
    }

    public rotateBubbles(camera: THREE.PerspectiveCamera) {
        for (const mesh of this.bubbles) {
            const bubblePosition = mesh.position;
            const cameraPosition = camera.position.clone();
            cameraPosition.y = bubblePosition.y;
            mesh.lookAt(cameraPosition);
        }
    }

}





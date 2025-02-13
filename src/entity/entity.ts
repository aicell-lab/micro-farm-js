import * as THREE from 'three';
import { PlayerController } from './playerController';
import { ArmController } from './armController';
import { PhysicsController } from './physicsController';
import { createNameplate, createBubbleStatus } from './nameplate';

export interface EntityOptions {
    object: THREE.Object3D;
    playerController?: PlayerController;
    armController?: ArmController;
    physicsController?: PhysicsController;
    nametag?: string;
}

export class Entity {
    object: THREE.Object3D;
    playerController?: PlayerController;
    armController?: ArmController;
    physicsController?: PhysicsController;
    nametagMesh?: THREE.Mesh;

    constructor({ object, playerController, armController, physicsController, nametag }: EntityOptions) {
        this.object = object;
        this.playerController = playerController;
        this.armController = armController;
        this.physicsController = physicsController;
        if (nametag)
            this.setNametag(nametag);
    }

    private setNametag(nametag: string) {
        //this.nametagMesh = createNameplate({ text: nametag, font: '50px Verdana', color: 'yellow' });
        this.nametagMesh = createBubbleStatus({text: "processing...", font: '50px Verdana', color: 'black'})
    }

    public update(delta: number): void {
        this.playerController?.update(this.object, delta);
        this.armController?.update(delta);
    }

    public updateNameplate(camera: THREE.PerspectiveCamera) {
        if (!this.nametagMesh) return;

        this.nametagMesh.position.copy(this.object.position).add(new THREE.Vector3(0, 1, 0));
        const nameplatePosition = this.nametagMesh.position;
        const cameraPosition = camera.position.clone();
        cameraPosition.y = nameplatePosition.y;
        this.nametagMesh.lookAt(cameraPosition);
    }

}





import * as THREE from 'three';
import { PlayerController } from './playerController';
import { ArmController } from './armController';
import { PhysicsController } from './physicsController';
import { createBubbleStatus, createSpeechBubbleTexture, NameplateOptions } from './nameplate';
import { Assets } from '../res/assets';
import { Textures } from '../setup/enums';

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
    bubbles: THREE.Mesh[];

    constructor({ object, playerController, armController, physicsController, nametag }: EntityOptions) {
        this.bubbles = [];
        this.object = object;
        this.playerController = playerController;
        this.armController = armController;
        this.physicsController = physicsController;
        if (nametag)
            this.setNametag(nametag);
    }

    private getNametagTexture(text: string): THREE.CanvasTexture {
        let options: NameplateOptions = { text: text, font: '50px Verdana', color: 'black' };
        const testImg = Assets.getInstance().getTextures().get(Textures.Error);
        return createSpeechBubbleTexture(options.text, options.font, options.color, testImg);
    }

    public setNametag(text: string) {
        if (this.nametagMesh) {
            const textMaterial = this.nametagMesh.material as THREE.MeshBasicMaterial;
            textMaterial.map = this.getNametagTexture(text);
            textMaterial.needsUpdate = true;
        } else {
            this.nametagMesh = createBubbleStatus({ text: text, font: '50px Verdana', color: 'yellow' });
        }
    }

    public getNametagMesh(): THREE.Mesh | undefined {
        return this.nametagMesh;
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

    public rotateBubbles(camera: THREE.PerspectiveCamera) {
        for (const mesh of this.bubbles) {
            const bubblePosition = mesh.position;
            const cameraPosition = camera.position.clone();
            cameraPosition.y = bubblePosition.y;
            mesh.lookAt(cameraPosition);
        }
    }

}





import * as THREE from 'three';
import { PhysicsController } from './physicsController';
import { createBubbleStatus, createSpeechBubbleTexture, BubbleOptions } from './nameplate';
import { Assets } from '../res/assets';
import { Textures } from '../setup/enums';

export interface EntityOptions {
    object: THREE.Object3D;
    physicsController?: PhysicsController;
    nametag?: string;
    animations?: THREE.AnimationClip[];
}

export class Entity {
    object: THREE.Object3D;
    animations?: THREE.AnimationClip[];
    physicsController?: PhysicsController;
    nametagMesh?: THREE.Mesh;
    bubbles: THREE.Mesh[];

    constructor({ object, physicsController, nametag, animations }: EntityOptions) {
        this.bubbles = [];
        this.object = object;
        this.physicsController = physicsController;
        this.animations = animations;
        if (nametag)
            this.setNametag(nametag);
    }

    private getNametagTexture(text: string): THREE.CanvasTexture {
        let options: BubbleOptions = { text: text, font: '50px Verdana', color: 'black', texture: Textures.Error, textureColor: 'red' };
        const img = Assets.getInstance().getTextures().get(options.texture)!;
        return createSpeechBubbleTexture(options.text, options.font, options.color, img, options.textureColor);
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





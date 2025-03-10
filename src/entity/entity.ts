import * as THREE from 'three';
import { Bubble } from './bubble';
import { SelectBox } from './selectBox';

export interface EntityOptions {
    object: THREE.Object3D;
    meshes?: Record<string, THREE.Mesh>;
}

export class Entity {
    object: THREE.Object3D;
    meshes: Map<string, THREE.Mesh>;
    bubbles: Bubble[];
    selectBoxes: SelectBox[];

    constructor({ object, meshes = {} }: EntityOptions) {
        this.object = object;
        this.meshes = new Map(Object.entries(meshes));
        this.bubbles = [];
        this.selectBoxes = [];
    }

    public getMesh(name: string): THREE.Mesh | undefined {
        return this.meshes.get(name);
    }

    public addMesh(name: string, mesh: THREE.Mesh): void {
        this.meshes.set(name, mesh);
        this.object.add(mesh);
    }

}





import * as THREE from 'three';
import { FileCollections } from '../types/assetTypes';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { modelFilepaths } from './paths';
import { Models } from '../types/models';

function applyStandardMaterial(obj: THREE.Object3D) {
    obj.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (!mesh.material) {
                mesh.material = new THREE.MeshStandardMaterial({ color: 0x888888 });
            }
        }
    });
}

function loadOBJ(collection: FileCollections, filepath: string): THREE.Object3D | null {
    const objFile = collection.textFiles.get(filepath);
    let obj = null;
    if (objFile) {
        const loader = new OBJLoader();
        obj = loader.parse(objFile);
        applyStandardMaterial(obj);
    }
    return obj;
}

export function loadModels(collection: FileCollections): Map<Models, THREE.Object3D> {
    let modelMap: Map<Models, THREE.Object3D> = new Map();
    const keys: Models[] = [Models.OpticalTable];
    for (const key of keys) {
        var obj = loadOBJ(collection, modelFilepaths[key]);
        if (obj)
            modelMap.set(key, obj);
    }
    return modelMap;
}

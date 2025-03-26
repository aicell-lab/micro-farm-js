import * as THREE from 'three';
import { FileCollections } from "../types/assetTypes";
import { Animations } from '../setup/enums';
import { animationFilepaths } from '../setup/constants';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface AnimationAsset {
    model: THREE.Object3D;
    animations: THREE.AnimationClip[];
}

/* 
Currently only loading GLTF in binary format (GLB) is supported.
*/
async function loadAnimation(type: Animations, files: FileCollections): Promise<AnimationAsset | null> {
    const filepath = animationFilepaths[type];
    const glbArrayBuffer = files.binaryFiles.get(filepath);
    if (!glbArrayBuffer) {
        console.error("GLB file not found!", filepath);
        return null;
    }

    const loader = new GLTFLoader();
    const glbData = new Uint8Array(glbArrayBuffer);

    return new Promise((resolve, reject) => {
        loader.parse(glbData.buffer, '', (gltf) => {
            const model = gltf.scene.children[0];
            model.position.set(0, 0, 0);
            resolve({ model: model, animations: gltf.animations });
        }, (error) => {
            console.error("Error loading GLB:", error);
            reject(error);
        });
    });
}


export async function loadAnimations(files: FileCollections): Promise<Map<Animations, AnimationAsset>> {
    let animMap: Map<Animations, AnimationAsset> = new Map();
    const keys: Animations[] = [Animations.Human];
    for (const key of keys) {
        let animation = await loadAnimation(key, files);
        if (animation) {
            animMap.set(key, animation);
        }
    }
    return animMap;
}


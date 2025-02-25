import * as THREE from 'three';
import { FileCollections } from "../types/assetTypes";
import { getFileCollectionsNoThrow } from "./assetOrganizer";
import { loadModels } from './modelLoader';

import { URDFRobot } from 'urdf-loader';
import { loadURDF } from './urdf';
import { Robots, Models, Animations, Textures } from '../setup/enums';
import { AnimationAsset, loadAnimations } from './animationLoader';
import { textureFilepaths } from '../setup/constants';


async function loadTextures(files: FileCollections): Promise<Map<Textures, THREE.Texture>> {
    const textureMap = new Map<Textures, THREE.Texture>();
    const keys: Textures[] = [Textures.Error, Textures.PhotoCamera, Textures.Timelapse, Textures.Timer];

    for (const key of keys) {
        const buffer = files.binaryFiles.get(textureFilepaths[key]);
        if (!buffer) {
            throw new Error(`Failed to load png data: ${key}`);
        }
        const blob = new Blob([buffer], { type: 'image/png' });
        const url = URL.createObjectURL(blob);
        const image = new Image();
        await new Promise<void>((resolve, reject) => {
            image.onload = () => {
                const texture = new THREE.Texture(image);
                texture.needsUpdate = true;
                textureMap.set(key, texture);
                resolve();
            };
            image.onerror = reject;
            image.src = url;
        });
        URL.revokeObjectURL(url);
    }
    return textureMap;
}

async function loadURDFs(): Promise<Map<Robots, URDFRobot>> {
    let robotMap: Map<Robots, URDFRobot> = new Map();
    for (const typeValue of Object.values(Robots)) {
        if (typeof typeValue === 'number') { // Ensure it's a number
            const type = typeValue as Robots;
            robotMap.set(type, await loadURDF(type)); // Use 'type' here
        }
    }
    return robotMap;
}

export class Assets {

    private static instance: Assets;
    private files: FileCollections;
    private modelMap: Map<Models, THREE.Object3D>;
    private robotMap: Map<Robots, URDFRobot>;
    private animationMap: Map<Animations, AnimationAsset>;
    private textureMap: Map<Textures, THREE.Texture>;

    private constructor() {
        this.files = { textFiles: new Map(), binaryFiles: new Map() };
        this.modelMap = new Map();
        this.robotMap = new Map();
        this.animationMap = new Map();
        this.textureMap = new Map();
    }

    public static async init(): Promise<Assets> {
        if (!Assets.instance) {
            const assets = new Assets();
            assets.files = await getFileCollectionsNoThrow();
            assets.modelMap = loadModels(assets.files);
            assets.animationMap = await loadAnimations(assets.files);
            assets.textureMap = await loadTextures(assets.files);
            assets.robotMap = await loadURDFs();
            Assets.instance = assets;
        }
        return Assets.instance;
    }

    public static getInstance(): Assets {
        if (!Assets.instance) {
            throw new Error("Assets has not been initialized. Call init) first.");
        }
        return Assets.instance;
    }

    public getModels(): Map<Models, THREE.Object3D> {
        return this.modelMap;
    }

    public getRobots(): Map<Robots, URDFRobot> {
        return this.robotMap;
    }

    public getAnimations(): Map<Animations, AnimationAsset> {
        return this.animationMap;
    }

    public getTextures(): Map<Textures, THREE.Texture> {
        return this.textureMap;
    }

    public getFiles(): FileCollections {
        return this.files;
    }

} 
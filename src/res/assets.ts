import * as THREE from 'three';
import { FileCollections } from "../types/assetTypes";
import { getFileCollectionsNoThrow } from "./assetOrganizer";
import { loadModels } from './modelLoader';

import { URDFRobot } from 'urdf-loader';
import { loadURDF } from './urdf';
import { Robots, Models, Animations, Textures } from '../setup/enums';
import { AnimationAsset, loadAnimations } from './animationLoader';
import { textureFilepaths } from '../setup/constants';
import { URDFVisual } from 'urdf-loader';


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
    const robotEntries: [Robots, URDFRobot][] = await Promise.all(
        Object.values(Robots)
            .filter((value): value is Robots => typeof value === 'number') // Type guard
            .map(async (type): Promise<[Robots, URDFRobot]> => [type, await loadURDF(type)])
    );

    return new Map(robotEntries);
}


async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function countURDFMeshes(robots: Map<Robots, URDFRobot>): number {
    let totalMeshes = 0;

    function countMeshes(obj: THREE.Object3D) {
        if (obj.type === "URDFVisual") {
            let visual = obj as URDFVisual;
            visual.traverse(child => {
                if (child instanceof THREE.Mesh) {
                    totalMeshes++;
                }
            });
        }

        for (const child of obj.children) {
            countMeshes(child);
        }
    }
    robots.forEach(robot => {
        countMeshes(robot);
    });

    return totalMeshes;
}

async function waitForMeshes(assets: Assets, expectedMeshes: number, delayMs: number = 20) {
    // urdf-loader package is not "awaiting" visuals & meshes, so this sleep hack is needed in order to wait for the library to internally finish loading.
    let numMeshes = 0;
    while (numMeshes !== expectedMeshes) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
        numMeshes = countURDFMeshes(assets.getRobots());
    }
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

            const [modelMap, animationMap, textureMap, robotMap] = await Promise.all([
                loadModels(assets.files),
                loadAnimations(assets.files),
                loadTextures(assets.files),
                loadURDFs()
            ]);

            assets.modelMap = modelMap;
            assets.animationMap = animationMap;
            assets.textureMap = textureMap;
            assets.robotMap = robotMap;
            Assets.instance = assets;

            const NUM_EXPECTED_MESHES = 11;
            await waitForMeshes(assets, NUM_EXPECTED_MESHES);

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
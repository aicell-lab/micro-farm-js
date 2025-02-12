import * as THREE from 'three';
import { FileCollections } from "../types/assetTypes";
import { getFileCollectionsNoThrow } from "./assetOrganizer";
import { loadModels } from './modelLoader';

import { URDFRobot } from 'urdf-loader';
import { loadURDF } from './urdf';
import { Robots, Models, Animations } from '../setup/enums';
import { AnimationAsset, loadAnimations } from './animationLoader';

export class Assets {

    private static instance: Assets;
    private files: FileCollections;
    private modelMap: Map<Models, THREE.Object3D>;
    private robotMap: Map<Robots, URDFRobot>;
    private animationMap: Map<Animations, AnimationAsset>;

    private constructor() {
        this.files = { textFiles: new Map(), binaryFiles: new Map() };
        this.modelMap = new Map();
        this.robotMap = new Map();
        this.animationMap = new Map();
    }

    public static async init(): Promise<Assets> {
        if (!Assets.instance) {
            const assets = new Assets();
            assets.files = await getFileCollectionsNoThrow();
            assets.modelMap = loadModels(assets.files);
            assets.animationMap = await loadAnimations(assets.files);
            assets.robotMap.set(Robots.OpticalTable, await loadURDF(Robots.OpticalTable));
            console.log(assets.animationMap);
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

    public getFiles(): FileCollections {
        return this.files;
    }

} 
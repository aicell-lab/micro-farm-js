import * as THREE from 'three';
import { FileCollections } from "../types/assetTypes";
import { getFileCollectionsNoThrow } from "./assetOrganizer";
import { Models } from "../types/models";
import { loadModels } from './modelLoader';

export class Assets {

    private static instance: Assets;
    private files: FileCollections;
    private modelMap: Map<Models, THREE.Object3D>;

    private constructor() {
        this.files = { textFiles: new Map(), binaryFiles: new Map() };
        this.modelMap = new Map();
    }

    public static async init(): Promise<Assets> {
        if (!Assets.instance) {
            const assets = new Assets();
            assets.files = await getFileCollectionsNoThrow();
            assets.modelMap = loadModels(assets.files);
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

    public getFiles(): FileCollections {
        return this.files;
    }

} 
import { SceneSetup } from './sceneSetup';
import { SceneSystem } from './animation';
import { FileCollections, getFileCollections, createBlobURIs } from './assets';

async function loadAssets(): Promise<FileCollections> {
    try {
        const fileMaps = await getFileCollections();
        console.log('ZIP file loaded and extracted successfully.', fileMaps);
        return fileMaps
    } catch (error) {
        console.error('Error during ZIP loading:', error);
    }
    return { textFiles: new Map(), binaryFiles: new Map() };
}

async function initializeApp() {
    const fileMaps = await loadAssets();
    const blobs = createBlobURIs(fileMaps);
    console.log(blobs);
    const sceneSetup = new SceneSetup(fileMaps);
    let sceneSystem = new SceneSystem(sceneSetup);
    sceneSystem.mainLoop();
}

initializeApp();

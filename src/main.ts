import { SceneSetup } from './sceneSetup';
import { animate } from './animation';
import { FileCollections, getFileCollections } from './assets';

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
    const sceneSetup = new SceneSetup(fileMaps);
    animate(sceneSetup);
}

initializeApp();

import { SceneSetup } from './sceneSetup';
import { SceneSystem } from './sceneSystem';
import { getFileCollectionsNoThrow, createBlobURIs } from './assets';

async function initializeApp() {
    const fileMaps = await getFileCollectionsNoThrow();
    const blobs = createBlobURIs(fileMaps);
    console.log(blobs);
    const sceneSetup = new SceneSetup(fileMaps);
    let sceneSystem = new SceneSystem(sceneSetup);
    sceneSystem.mainLoop();
}

initializeApp();

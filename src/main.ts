import { SceneSetup } from './sceneSetup';
import { SceneSystem } from './sceneSystem';
import { getFileCollectionsNoThrow } from './assets';
import { createBlobURIs } from './assetURI';

async function initializeApp() {
    const fileMaps = await getFileCollectionsNoThrow();
    const blobs = createBlobURIs(fileMaps); // TODO: Replace URDF paths with BlobURIs
    console.log(blobs);
    const sceneSetup = new SceneSetup(fileMaps);
    let sceneSystem = new SceneSystem(sceneSetup);
    sceneSystem.mainLoop();
}

initializeApp();

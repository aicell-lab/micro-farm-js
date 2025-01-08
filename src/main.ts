import { getSceneSetup } from './setup/sceneSetup';
import { SceneSystem } from './system/sceneSystem';
import { getFileCollectionsNoThrow } from './res/assets';
//import { createBlobURIs } from './res/assetURI';

async function initializeApp() {
    const fileMaps = await getFileCollectionsNoThrow();
    
    // TODO: Replace URDF paths with BlobURIs
    // const blobs = createBlobURIs(fileMaps);
    // console.log(blobs);
    
    let sceneSystem = new SceneSystem(getSceneSetup(fileMaps));
    sceneSystem.simulationLoop();
}

initializeApp();

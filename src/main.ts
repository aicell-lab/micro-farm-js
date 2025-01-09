import { getSceneSetup } from './setup/sceneSetup';
import { SceneSystem } from './system/sceneSystem';
import { getFileCollectionsNoThrow } from './res/assets';
import { CameraController, getCameraSetup } from './system/cameraController';
import { Human } from './system/actor';
//import { createBlobURIs } from './res/assetURI';

async function initializeApp() {
    const fileMaps = await getFileCollectionsNoThrow();
    
    // TODO: Replace URDF paths with BlobURIs
    // const blobs = createBlobURIs(fileMaps);
    // console.log(blobs);
    
    let sceneSetup = getSceneSetup(fileMaps);
    let human = new Human();
    sceneSetup.scene.add(human.mesh);
    let cameraController = new CameraController(getCameraSetup(), human.mesh);
    let sceneSystem = new SceneSystem(sceneSetup, cameraController, human);
    sceneSystem.simulationLoop();
}

initializeApp();

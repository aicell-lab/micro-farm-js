import { SceneSystem } from './system/sceneSystem';
import { CameraController, getCameraSetup } from './system/cameraController';
import { Assets } from './res/assets';
import { getSceneSetup } from './setup/room';
import { ActorFactory } from './system/actorFactory';

async function initializeApp() {
    await Assets.init();
    let sceneSetup = getSceneSetup();
    let human = new ActorFactory().createHuman();
    sceneSetup.scene.add(human.mesh);
    let cameraController = new CameraController(getCameraSetup(), human.mesh);
    let sceneSystem = new SceneSystem(sceneSetup, cameraController, human);
    sceneSystem.simulationLoop();
}

initializeApp();

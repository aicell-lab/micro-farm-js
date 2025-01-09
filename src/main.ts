import { getSceneSetup } from './setup/sceneSetup';
import { SceneSystem } from './system/sceneSystem';
import { CameraController, getCameraSetup } from './system/cameraController';
import { Human } from './system/actor';
import { Assets } from './res/assets';

async function initializeApp() {
    await Assets.init();
    let sceneSetup = getSceneSetup();
    let human = new Human();
    sceneSetup.scene.add(human.mesh);
    let cameraController = new CameraController(getCameraSetup(), human.mesh);
    let sceneSystem = new SceneSystem(sceneSetup, cameraController, human);
    sceneSystem.simulationLoop();
}

initializeApp();

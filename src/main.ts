import { SceneSystem } from './system/sceneSystem';
import { Assets } from './res/assets';
import { getSceneSetup } from './setup/room';

async function initializeApp() {
    await Assets.init();
    let sceneSetup = getSceneSetup();
    let sceneSystem = new SceneSystem(sceneSetup);
    sceneSystem.simulationLoop();
}

initializeApp();

import { SceneSystem } from './system/sceneSystem';
import { Assets } from './res/assets';
import { createSceneSetup } from './setup/room';

async function initializeApp() {
    await Assets.init();
    new SceneSystem(createSceneSetup()).simulationLoop();
}

initializeApp();

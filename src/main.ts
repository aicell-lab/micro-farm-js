import { SceneSystem } from './system/sceneSystem';
import { Assets } from './res/assets';
import { createRoom } from './setup/room';
import { ActorFactory } from './setup/actorFactory';

async function initializeApp() {
    await Assets.init();
    new SceneSystem(createRoom(), new ActorFactory().createActors()).runSimulationLoop();
}

initializeApp();

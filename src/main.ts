import { SceneSystem } from './system/sceneSystem';
import { Assets } from './res/assets';
import { Room } from './setup/room';
import { ActorFactory } from './setup/actorFactory';

async function initializeApp() {
    await Assets.init();
    new SceneSystem(new Room(), new ActorFactory().createActors()).runSimulationLoop();
}

initializeApp();

import { SceneSystem } from './system/sceneSystem';
import { Assets } from './res/assets';
import { createRoom } from './setup/room';
import { ActorFactory } from './setup/actorFactory';
import { SceneFactory } from './setup/sceneFactory';

async function initializeApp() {
    await Assets.init();
    let room = createRoom();
    let actors = new ActorFactory().createActors();
    let scene = new SceneFactory(room, actors).createScene();
    new SceneSystem(room, actors, scene).runSimulationLoop();
}

initializeApp();

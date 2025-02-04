import { SceneSystem } from './system/sceneSystem';
import { Assets } from './res/assets';
import { ActorFactory } from './setup/actorFactory';
import { SceneFactory } from './setup/sceneFactory';
import { RoomObjectFactory } from './setup/roomObjectFactory';
import { AmmoSingleton } from './setup/ammoSingleton';

async function init() {
    await AmmoSingleton.init();
    await Assets.init();
}

function createSceneSystem(): SceneSystem {
    let room = new RoomObjectFactory().createRoom();
    let actors = new ActorFactory().createActors();
    let scene = new SceneFactory(room, actors).createScene();
    return new SceneSystem(room, actors, scene);
}

async function runApp() {
    await init();
    createSceneSystem().runSimulationLoop();
}

runApp();

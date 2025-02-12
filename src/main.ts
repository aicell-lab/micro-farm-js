import "./styles.css";

import { SceneSystem } from './system/sceneSystem';
import { Assets } from './res/assets';
import { ActorFactory } from './setup/actorFactory';
import { SceneFactory } from './setup/sceneFactory';
import { RoomObjectFactory } from './setup/roomObjectFactory';
import { AmmoSingleton } from './setup/ammoSingleton';
import { PhysicsWorld } from './system/physicsWorld';

async function init() {
    await AmmoSingleton.init();
    await Assets.init();
}

function createSceneSystem(): SceneSystem {
    let physicsWorld = new PhysicsWorld();
    let room = new RoomObjectFactory(physicsWorld).createRoom();
    let actors = new ActorFactory().createActors();
    let scene = new SceneFactory(room, actors).createScene();
    return new SceneSystem(room, actors, scene, physicsWorld);
}

async function runApp() {
    await init();
    createSceneSystem().runSimulationLoop();
}


runApp();

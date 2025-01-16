import { SceneSystem } from './system/sceneSystem';
import { Assets } from './res/assets';
import { ActorFactory } from './setup/actorFactory';
import { SceneFactory } from './setup/sceneFactory';
import { RoomObjectFactory } from './setup/roomObjectFactory';

import { loadURDF } from './res/urdf';
import { RobotType } from './setup/constants';

async function initializeApp() {

    let table = await loadURDF(RobotType.OpticalTable);

    await Assets.init();
    let room = new RoomObjectFactory().createRoom();
    let actors = new ActorFactory().createActors();
    let scene = new SceneFactory(room, actors).createScene();
    scene.add(table);


    new SceneSystem(room, actors, scene).runSimulationLoop();
}

initializeApp();

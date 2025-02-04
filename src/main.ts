import { SceneSystem } from './system/sceneSystem';
import { Assets } from './res/assets';
import { ActorFactory } from './setup/actorFactory';
import { SceneFactory } from './setup/sceneFactory';
import { RoomObjectFactory } from './setup/roomObjectFactory';


class AmmoSingleton {
    private static instance: typeof import("ammojs-typed").default | null = null;
    static async init() {
        if (!this.instance) {
            this.instance = (await (await import("ammojs-typed")).default()) as typeof import("ammojs-typed").default;
        }
    }
    static get() {
        if (!this.instance) {
            throw new Error("Ammo has not been initialized. Call AmmoSingleton.init() first.");
        }
        return this.instance;
    }
}


async function initializeApp() {

    await AmmoSingleton.init();
    let a = AmmoSingleton.get();
    console.log(new a.btVector3(11, 2, 3).x());

    await Assets.init();
    let room = new RoomObjectFactory().createRoom();
    let actors = new ActorFactory().createActors();
    let scene = new SceneFactory(room, actors).createScene();

    new SceneSystem(room, actors, scene).runSimulationLoop();
}

initializeApp();

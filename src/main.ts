import { SceneSystem } from './system/sceneSystem';
import { Assets } from './res/assets';
import { ActorFactory } from './setup/actorFactory';
import { SceneFactory } from './setup/sceneFactory';
import { RoomObjectFactory } from './setup/roomObjectFactory';

/*import { LoadingManager } from 'three';
import URDFLoader from 'urdf-loader';

function loadURDF(loader: URDFLoader, packageName: string, packagePath: string, urdfPath: string): Promise<any> {
    return new Promise((resolve, reject) => {

        loader.packages = {
            [packageName]: packagePath
        }

        loader.load(
            urdfPath,
            robot => resolve(robot),
            undefined,
            error => reject(error)
        );
    });
}*/

async function initializeApp() {


    /*const manager = new LoadingManager();
    const loader = new URDFLoader(manager);
    let table = await loadURDF(loader, 'digital_twin_lab-4', './assets/packages/digital_twin_lab-4', './assets/packages/digital_twin_lab-4/urdf/robot_arm.urdf');
    console.log(table);*/

    await Assets.init();
    let room = new RoomObjectFactory().createRoom();
    let actors = new ActorFactory().createActors();
    let scene = new SceneFactory(room, actors).createScene();
    //scene.add(table);


    new SceneSystem(room, actors, scene).runSimulationLoop();
}

initializeApp();

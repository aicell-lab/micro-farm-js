import { CameraController } from './cameraController';
import { SimulationLoop } from './simLoop';
import { SceneSetup } from '../setup/room';
import { ActorFactory } from '../setup/actorFactory';
import { ActorController } from './actorController';
import { RenderController } from './renderController';

export class SceneSystem {

  private actorController: ActorController;
  private cameraController: CameraController;
  private simLoop: SimulationLoop;

  constructor(sceneSetup: SceneSetup) {
    let actors = new ActorFactory().createRoomActors();
    this.cameraController = new CameraController(actors.player.mesh);
    sceneSetup.scene.add(actors.player.mesh);
    let renderController = new RenderController(sceneSetup.scene, this.cameraController.getCamera());
    this.simLoop = new SimulationLoop(sceneSetup, actors, renderController);
    this.actorController = new ActorController(actors);
  }

  simulationLoop = () => {
    this.cameraController.setOffset();
    this.actorController.handleUserInput();
    this.simLoop.step();
    this.cameraController.update();
    requestAnimationFrame(this.simulationLoop);
  };

}
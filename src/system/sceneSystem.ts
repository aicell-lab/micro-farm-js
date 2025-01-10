import { CameraController } from './cameraController';
import { SimulationLoop } from './simLoop';
import { SceneSetup } from '../setup/room';
import { ActorFactory } from './actorFactory';
import { ActorController } from './actorController';

export class SceneSystem {

  private actorController: ActorController;
  private cameraController: CameraController;
  private simLoop: SimulationLoop;

  constructor(sceneSetup: SceneSetup) {
    let actors = new ActorFactory().createRoomActors();
    this.cameraController = new CameraController(actors.player.mesh);
    sceneSetup.scene.add(actors.player.mesh);
    this.simLoop = new SimulationLoop(sceneSetup, actors);
    this.actorController = new ActorController(actors);
  }

  simulationLoop = () => {
    this.cameraController.setOffset();
    this.actorController.handleUserInput();
    this.simLoop.step(this.cameraController.getCamera());
    this.cameraController.update();
    requestAnimationFrame(this.simulationLoop);
  };

}
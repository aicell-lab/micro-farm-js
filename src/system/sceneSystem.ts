import * as THREE from 'three';
import { CameraController } from './cameraController';
import { SimulationLoop } from './simulationLoop';
import { Room } from '../setup/room';
import { ActorController } from './actorController';
import { RenderController } from './renderController';
import { RoomActors } from '../actor/roomActors';
import { DashboardController } from './dashboardController';
import { InputListener } from '../io/input';

export class SceneSystem {
  private dashboardController: DashboardController;
  private actorController: ActorController;
  private cameraController: CameraController;
  private renderController: RenderController;
  private simulationLoop: SimulationLoop;
  private clock: THREE.Clock;

  constructor(room: Room, actors: RoomActors, scene: THREE.Scene) {
    this.cameraController = new CameraController(actors.player.object);
    this.dashboardController = new DashboardController();
    this.renderController = new RenderController(scene, this.cameraController.getCamera());
    this.actorController = new ActorController(actors, new InputListener(this.dashboardController));
    this.simulationLoop = new SimulationLoop(room, actors);
    this.clock = new THREE.Clock();
  }

  runSimulationLoop = () => {
    this.cameraController.executeWithOffsetHandling(() => {
      this.processNextFrame();
    });
    requestAnimationFrame(this.runSimulationLoop);
  };

  processNextFrame() {
    this.actorController.handleUserInput();
    this.simulationLoop.step(this.clock.getDelta());
    this.renderController.render();
  }

}
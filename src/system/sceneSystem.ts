import * as THREE from 'three';
import { CameraController } from './cameraController';
import { SimulationLoop } from './simulationLoop';
import { Room } from '../setup/room';
import { ActorController } from './actorController';
import { RenderController } from './renderController';
import { DashboardController } from './dashboardController';
import { InputListener } from '../io/input';
import { PhysicsWorld } from './physicsWorld';
import { Actors } from '../setup/room';

export class SceneSystem {
  private dashboardController: DashboardController;
  private actorController: ActorController;
  private cameraController: CameraController;
  private renderController: RenderController;
  private simulationLoop: SimulationLoop;
  private clock: THREE.Clock;

  constructor(room: Room, actors: Actors, scene: THREE.Scene, physicsWorld: PhysicsWorld) {
    this.cameraController = new CameraController(actors.player.object);
    this.dashboardController = new DashboardController();
    this.renderController = new RenderController(scene, this.cameraController.getCamera());
    this.actorController = new ActorController(actors, new InputListener(this.dashboardController));
    this.simulationLoop = new SimulationLoop(room, actors, physicsWorld);
    this.clock = new THREE.Clock();
  }

  runSimulationLoop = () => {
    this.processNextFrame();
    requestAnimationFrame(this.runSimulationLoop);
  };

  processNextFrame() {
    const dt = this.clock.getDelta();
    this.cameraController.update(dt);
    this.actorController.handleUserInput();
    this.simulationLoop.step(dt);
    this.renderController.render();
  }

}
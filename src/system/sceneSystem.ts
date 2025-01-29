import * as THREE from 'three';
import { CameraController } from './cameraController';
import { SimulationLoop } from './simulationLoop';
import { Room } from '../setup/room';
import { ActorController } from './actorController';
import { RenderController } from './renderController';
import { FrameTime } from '../types/frameTime';
import { RoomActors } from '../actor/roomActors';
import { DashboardController } from './dashboardController';
import { InputListener } from '../io/input';
import { CollisionController } from './collisionController';

function getFrameTime(prevFrameTime?: FrameTime): FrameTime {
  const timestamp = performance.now();
  const delta = prevFrameTime ? (timestamp - prevFrameTime.timestamp) / 1000.0 : 0;
  return { delta, timestamp };
}

export class SceneSystem {
  private collisionController: CollisionController;
  private dashboardController: DashboardController;
  private actorController: ActorController;
  private cameraController: CameraController;
  private renderController: RenderController;
  private simulationLoop: SimulationLoop;
  private frameTime: FrameTime;

  constructor(room: Room, actors: RoomActors, scene: THREE.Scene) {
    this.cameraController = new CameraController(actors.player.object);
    this.dashboardController = new DashboardController();
    this.renderController = new RenderController(scene, this.cameraController.getCamera());
    this.actorController = new ActorController(actors, new InputListener(this.dashboardController));
    this.simulationLoop = new SimulationLoop(room, actors);
    this.frameTime = getFrameTime();
    this.collisionController = new CollisionController();
    this.collisionController.addObject(room.cube.object);
    this.collisionController.addObject(actors.player.object);
  }

  runSimulationLoop = () => {
    const updatedFrameTime = getFrameTime(this.frameTime);
    this.cameraController.executeWithOffsetHandling(() => {
      this.processNextFrame();
    });
    this.frameTime = updatedFrameTime
    requestAnimationFrame(this.runSimulationLoop);
  };

  processNextFrame() {
    this.collisionController.checkCollisions();
    this.actorController.handleUserInput();
    this.simulationLoop.step(this.frameTime.delta);
    this.renderController.render();
  }

}
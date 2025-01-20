import * as THREE from 'three';
import { CameraController } from './cameraController';
import { SimulationLoop } from './simulationLoop';
import { Room } from '../setup/room';
import { ActorController } from './actorController';
import { RenderController } from './renderController';
import { FrameTime } from '../types/frameTime';
import { RoomActors } from '../actor/roomActors';

function getFrameTime(prevFrameTime?: FrameTime): FrameTime {
  const timestamp = performance.now();
  const delta = prevFrameTime ? (timestamp - prevFrameTime.timestamp) / 1000.0 : 0;
  return { delta, timestamp };
}

export class SceneSystem {

  private actorController: ActorController;
  private cameraController: CameraController;
  private renderController: RenderController;
  private simulationLoop: SimulationLoop;
  private frameTime: FrameTime;

  constructor(room: Room, actors: RoomActors, scene: THREE.Scene) {
    this.cameraController = new CameraController(actors.player.object);
    this.renderController = new RenderController(scene, this.cameraController.getCamera());
    this.actorController = new ActorController(actors);
    this.simulationLoop = new SimulationLoop(room, actors);
    this.frameTime = getFrameTime();
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
    this.actorController.handleUserInput();
    this.simulationLoop.step(this.frameTime.delta);
    this.renderController.render();
  }

}
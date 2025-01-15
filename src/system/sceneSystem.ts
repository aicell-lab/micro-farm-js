import * as THREE from 'three';
import { CameraController } from './cameraController';
import { SimulationLoop } from './simLoop';
import { Room, createScene } from '../setup/room';
import { ActorController } from './actorController';
import { RenderController } from './renderController';
import { RoomActors } from '../setup/actor';
import { FrameTime } from '../types/frameTime';

function createAndPopulateScene(room: Room, actors: RoomActors) {
  let scene = createScene();
  populateScene(scene, actors, room);
  return scene;
}

function populateScene(scene: THREE.Scene, actors: RoomActors, room: Room): void {
  scene.add(actors.player.mesh);
  scene.add(room.floor);
  scene.add(room.opticalTable);
}

function getFrameTime(prevFrameTime?: FrameTime): FrameTime {
  const timestamp = performance.now();
  const delta = prevFrameTime ? (timestamp - prevFrameTime.timestamp) / 1000.0 : 0;
  return { delta, timestamp };
}

export class SceneSystem {

  private actorController: ActorController;
  private cameraController: CameraController;
  private renderController: RenderController;
  private simLoop: SimulationLoop;
  private frameTime: FrameTime;

  constructor(room: Room, actors: RoomActors) {
    let scene = createAndPopulateScene(room, actors);
    this.cameraController = new CameraController(actors.player.mesh);
    this.renderController = new RenderController(scene, this.cameraController.getCamera());
    this.actorController = new ActorController(actors);
    this.simLoop = new SimulationLoop(room, actors);
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
    this.simLoop.step(this.frameTime.delta);
    this.renderController.render();
  }

}
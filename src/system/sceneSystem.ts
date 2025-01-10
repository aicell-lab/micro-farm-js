import { CameraController } from './cameraController';
import { SimulationLoop } from './simLoop';
import { Room, createScene } from '../setup/room';
import { ActorController } from './actorController';
import { RenderController } from './renderController';
import * as THREE from 'three';
import { RoomActors } from '../setup/actor';

function populateScene(scene: THREE.Scene, actors: RoomActors, room: Room): void{
  scene.add(actors.player.mesh);
  scene.add(room.floor);
  scene.add(room.opticalTable);
}

export class SceneSystem {

  private actorController: ActorController;
  private cameraController: CameraController;
  private simLoop: SimulationLoop;

  constructor(room: Room, actors: RoomActors) {
    let scene = createScene();
    populateScene(scene, actors, room);
    this.cameraController = new CameraController(actors.player.mesh);
    let renderController = new RenderController(scene, this.cameraController.getCamera());
    this.simLoop = new SimulationLoop(room, actors, renderController);
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
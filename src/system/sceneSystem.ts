import * as THREE from 'three';
import { CameraController } from './cameraController';
import { SimulationLoop } from './simulationLoop';
import { Room } from '../setup/room';
import { ActorController } from './actorController';
import { RenderController } from './renderController';
import { InputListener } from '../io/input';
import { PhysicsWorld } from './physicsWorld';
import { Actors } from '../setup/room';
import { UIController } from './uiController';

export class SceneSystem {
  private uiController: UIController;
  private actorController: ActorController;
  private cameraController: CameraController;
  private renderController: RenderController;
  private simulationLoop: SimulationLoop;
  private clock: THREE.Clock;

  private scene: THREE.Scene;
  private counter: number = 0.0;
  private room: Room;

  constructor(room: Room, actors: Actors, scene: THREE.Scene, physicsWorld: PhysicsWorld) {
    this.cameraController = new CameraController(actors.player.object);
    let camera = this.cameraController.getCamera();
    this.uiController = new UIController(camera, room, actors);
    this.renderController = new RenderController(scene, camera);
    this.actorController = new ActorController(actors, new InputListener(this.uiController));
    this.simulationLoop = new SimulationLoop(room, actors, physicsWorld);
    this.clock = new THREE.Clock();
    this.scene = scene;
    this.room = room;

    this.scene.add(this.room.cube.getNametagMesh()!);
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
    this.uiController.updateSpatialUI();
    this.renderController.render();

    this.counter += dt;
    //this.scene.remove(this.room.cube.getNametagMesh()!);
    this.room.cube.setNametag(`value ${Math.floor(this.counter)}`);
    //this.scene.add(this.room.cube.getNametagMesh()!);

  }

}
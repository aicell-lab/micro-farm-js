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
import { PlayerController } from '../entity/playerController';

export class SceneSystem {
  private uiController: UIController;
  private actorController: ActorController;
  private cameraController: CameraController;
  private renderController: RenderController;
  private simulationLoop: SimulationLoop;
  private playerController: PlayerController;
  private clock: THREE.Clock;

  private scene: THREE.Scene;
  private room: Room;
  private actors: Actors;

  constructor(room: Room, actors: Actors, scene: THREE.Scene, physicsWorld: PhysicsWorld) {
    this.playerController = new PlayerController();
    this.cameraController = new CameraController(actors.player.object);
    let camera = this.cameraController.getCamera();
    this.uiController = new UIController(camera, room, actors);
    this.renderController = new RenderController(scene, camera);
    this.actorController = new ActorController(actors, new InputListener(this.uiController), this.playerController);
    this.simulationLoop = new SimulationLoop(room, actors, physicsWorld);
    this.clock = new THREE.Clock();
    this.scene = scene;
    this.room = room;
    this.actors = actors;

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
    this.playerController.update(this.actors.player.object, dt);
    this.simulationLoop.step(dt);
    this.uiController.updateSpatialUI();
    this.renderController.render();

    this.room.cube.setNametag(`value ${this.room.cube.object.position.x.toFixed(2)}`);

  }

}
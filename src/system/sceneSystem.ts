import * as THREE from 'three';
import { CameraController } from './cameraController';
import { SimulationLoop } from './simulationLoop';
import { ActorController } from './actorController';
import { RenderController } from './renderController';
import { InputListener } from '../io/input';
import { PhysicsWorld } from './physicsWorld';
import { UIController } from './uiController';
import { PlayerController } from '../entity/playerController';
import { TableController } from '../entity/tableController';
import { URDFRobot } from 'urdf-loader';
import { EntityCollection } from '../setup/entityCollection';

export class SceneSystem {
  private uiController: UIController;
  private actorController: ActorController;
  private cameraController: CameraController;
  private renderController: RenderController;
  private simulationLoop: SimulationLoop;
  private playerController: PlayerController;
  private tableController: TableController;
  private clock: THREE.Clock;
  private entities: EntityCollection;

  constructor(entities: EntityCollection, scene: THREE.Scene, physicsWorld: PhysicsWorld) {
    this.entities = entities;
    let actors = entities.getActors();
    let room = entities.getRoom();

    this.playerController = new PlayerController();
    this.tableController = new TableController(actors.table.object as URDFRobot, actors.table.bubbles);
    this.cameraController = new CameraController(actors.player.object);
    let camera = this.cameraController.getCamera();
    this.uiController = new UIController(camera, room, actors);
    this.renderController = new RenderController(scene, camera);
    this.actorController = new ActorController(actors, new InputListener(this.uiController), this.playerController, this.tableController);
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
    this.playerController.update(this.entities.getActors().player.object, dt);
    this.tableController.update(dt);
    this.simulationLoop.step(dt);
    this.uiController.updateSpatialUI();
    this.renderController.render();

  }

}
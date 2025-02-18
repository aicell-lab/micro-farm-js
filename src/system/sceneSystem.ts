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

interface Controllers {
  ui: UIController;
  camera: CameraController;
  render: RenderController;
  actor: ActorController;
  player: PlayerController;
  table: TableController;
}

function createControllers(entities: EntityCollection, scene: THREE.Scene): Controllers {
  let actors = entities.getActors();
  let cameraController = new CameraController(actors.player.object);
  let camera = cameraController.getCamera();

  let player = new PlayerController();
  let table = new TableController(actors.table.object as URDFRobot, actors.table.bubbles);
  let ui = new UIController(camera, entities);
  let input = new InputListener(ui);
  let render = new RenderController(scene, camera);
  let actor = new ActorController(actors, input, player, table);

  return {
    player: player,
    table: table,
    camera: cameraController,
    ui: ui,
    render: render,
    actor: actor,
  };
}

function updatePreSimulationStepControllers(dt: number, ctrl: Controllers, entities: EntityCollection): void {
  ctrl.camera.update(dt);
  ctrl.actor.handleUserInput();
  ctrl.player.update(entities.getActors().player.object, dt);
  ctrl.table.update(dt);
}

function updatePostSimulationStepControllers(ctrl: Controllers): void {
  ctrl.ui.updateSpatialUI();
  ctrl.render.render();
}


export class SceneSystem {
  private simulationLoop: SimulationLoop;
  private clock: THREE.Clock;
  private entities: EntityCollection;
  private controllers: Controllers;

  constructor(entities: EntityCollection, scene: THREE.Scene, physicsWorld: PhysicsWorld) {
    this.entities = entities;
    this.simulationLoop = new SimulationLoop(entities, physicsWorld);
    this.clock = new THREE.Clock();
    this.controllers = createControllers(entities, scene);
  }

  runSimulationLoop = () => {
    this.processNextFrame();
    requestAnimationFrame(this.runSimulationLoop);
  };

  processNextFrame() {
    const dt = this.clock.getDelta();
    updatePreSimulationStepControllers(dt, this.controllers, this.entities);
    this.simulationLoop.step(dt);
    updatePostSimulationStepControllers(this.controllers);
  }

}
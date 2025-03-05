import * as THREE from 'three';
import { CameraController } from '../ctrl/cameraController';
import { PhysicsSystem } from '../physics/physicsSystem';
import { ActorController } from '../ctrl/actorController';
import { RenderController, createCamera } from '../ctrl/renderController';
import { Input, InputListener } from '../io/input';
import { UIController } from '../ctrl/uiController';
import { PlayerController } from '../ctrl/playerController';
import { TableController } from '../ctrl/tableController';
import { EntityCollection } from '../setup/entityCollection';
import { syncGraphics } from '../physics/physicsSync';

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
  let camera = createCamera();
  let cameraController = new CameraController(actors.player.object, camera);
  let player = new PlayerController(entities.getActors().player);
  let table = new TableController(actors.table, actors.arm);
  let ui = new UIController(camera, entities, table);
  let render = new RenderController(scene, camera);
  let actor = new ActorController(actors, player, table);

  return {
    player: player,
    table: table,
    camera: cameraController,
    ui: ui,
    render: render,
    actor: actor,
  };
}

function updatePreSimulationStepControllers(dt: number, ctrl: Controllers, entities: EntityCollection, input: Input): void {
  ctrl.camera.update(dt);
  ctrl.actor.processActions(input.keys, ctrl.ui.getArmCommands());
  ctrl.player.update(entities.getActors().player.object, dt);
  ctrl.table.update(dt);
}

function updatePostSimulationStepControllers(ctrl: Controllers, input: Input): void {
  ctrl.ui.update(input);
  ctrl.render.render();
}

export class SceneSystem {
  private physicsSystem: PhysicsSystem;
  private clock: THREE.Clock;
  private entities: EntityCollection;
  private controllers: Controllers;
  private inputListener: InputListener;

  constructor(entities: EntityCollection, scene: THREE.Scene) {
    this.inputListener = new InputListener();
    this.entities = entities;
    this.physicsSystem = new PhysicsSystem(entities);
    this.clock = new THREE.Clock();
    this.controllers = createControllers(entities, scene);
  }

  runSimulationLoop = () => {
    this.processNextFrame();
    requestAnimationFrame(this.runSimulationLoop);
  };

  processNextFrame() {
    const dt = this.clock.getDelta();
    const input = this.inputListener.getInput();
    updatePreSimulationStepControllers(dt, this.controllers, this.entities, input);
    this.physicsSystem.step(dt);
    syncGraphics(this.entities, this.physicsSystem.getRigidBodyMap());
    updatePostSimulationStepControllers(this.controllers, input);
  }

}
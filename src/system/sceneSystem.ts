import * as THREE from 'three';
import { CameraController } from '../ctrl/cameraController';
import { SimulationLoop } from './simulationLoop';
import { ActorController } from '../ctrl/actorController';
import { RenderController, createCamera } from '../ctrl/renderController';
import { InputListener } from '../io/input';
import { PhysicsWorld } from './physicsWorld';
import { UIController } from '../ctrl/uiController';
import { PlayerController } from '../ctrl/playerController';
import { TableController } from '../ctrl/tableController';
import { URDFRobot } from 'urdf-loader';
import { EntityCollection } from '../setup/entityCollection';
import { KeyboardInput } from '../io/keyboard';
import { MouseInput } from '../io/mouse';

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
  let table = new TableController(actors.table.object as URDFRobot, actors.table.bubbles, actors.table.selectBoxes);
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

function updatePreSimulationStepControllers(dt: number, ctrl: Controllers, entities: EntityCollection, keys: KeyboardInput): void {
  ctrl.camera.update(dt);
  ctrl.actor.processActions(keys, ctrl.ui.getArmCommands());
  ctrl.player.update(entities.getActors().player.object, dt);
  ctrl.table.update(dt);
}

function updatePostSimulationStepControllers(ctrl: Controllers, mouse: MouseInput): void {
  ctrl.ui.update(mouse);
  ctrl.render.render();
}

export class SceneSystem {
  private simulationLoop: SimulationLoop;
  private clock: THREE.Clock;
  private entities: EntityCollection;
  private controllers: Controllers;
  private inputListener: InputListener;

  constructor(entities: EntityCollection, scene: THREE.Scene, physicsWorld: PhysicsWorld) {
    this.inputListener = new InputListener();
    this.entities = entities;
    this.simulationLoop = new SimulationLoop(entities, physicsWorld);
    this.clock = new THREE.Clock();
    this.controllers = createControllers(entities, scene);
  }

  runSimulationLoop() {
    this.processNextFrame();
    requestAnimationFrame(this.runSimulationLoop.bind(this));
  }

  private getInputs(): { keys: KeyboardInput; mouse: MouseInput } {
    return {
      keys: this.inputListener.getKeyboardInput(),
      mouse: this.inputListener.getMouseInput(),
    };
  }

  processNextFrame() {
    const dt = this.clock.getDelta();
    const { keys, mouse } = this.getInputs();
    updatePreSimulationStepControllers(dt, this.controllers, this.entities, keys);
    this.simulationLoop.step(dt);
    updatePostSimulationStepControllers(this.controllers, mouse);
  }

}
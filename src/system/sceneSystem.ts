import * as THREE from 'three';
import { CameraController } from '../ctrl/cameraController';
import { PhysicsSystem } from '../physics/physicsSystem';
import { EventMediator } from '../ctrl/eventMediator';
import { RenderController, createCamera } from '../ctrl/renderController';
import { Input, InputListener } from '../io/input';
import { UIController } from '../ctrl/uiController';
import { PlayerController } from '../ctrl/playerController';
import { TableController } from '../ctrl/tableController';
import { EntityCollection } from '../setup/entityCollection';
import { syncGraphics } from '../physics/physicsSync';
import { requestPointerLock, exitPointerLock } from './window';
import { togglePlayerVisibility } from './playerOpacity';
import { DialogController } from '../ctrl/dialogController';

interface Controllers {
  ui: UIController;
  camera: CameraController;
  render: RenderController;
  eventMediator: EventMediator;
  player: PlayerController;
  table: TableController;
  dialog: DialogController;
}

function createControllers(entities: EntityCollection, scene: THREE.Scene, physicsSystem: PhysicsSystem): Controllers {
  let actors = entities.getActors();
  let camera = createCamera();
  let cameraController = new CameraController(actors.player.object, camera);
  let player = new PlayerController(entities.getActors().player);
  let table = new TableController(actors.table, actors.arm);
  let ui = new UIController(camera, entities, table);
  let render = new RenderController(scene, camera);
  let eventMediator = new EventMediator(actors, player, table, physicsSystem);

  return {
    player: player,
    table: table,
    camera: cameraController,
    ui: ui,
    render: render,
    eventMediator: eventMediator,
    dialog: new DialogController(),
  };
}

function updatePrePhysicsControllers(dt: number, ctrl: Controllers, entities: EntityCollection, input: Input): void {
  ctrl.camera.update(dt, input);
  ctrl.eventMediator.processActions(input, ctrl.ui.getArmEvent());
  ctrl.player.update(entities.getActors().player.object, dt);
  ctrl.table.update(dt);
}

function updateUIAndRender(ctrl: Controllers, input: Input): void {
  let dialog = ctrl.dialog;
  ctrl.ui.update(input, dialog.isDialogVisible());
  if (ctrl.ui.hasDialogEvent()) {
    const dialogEvent = ctrl.ui.getDialogEvent();
    if (dialog.isDialogVisible()) {
      dialog.hideDialog();
    } else {
      dialog.showOpticsDialog(dialogEvent.opticsID);
    }
  }

  ctrl.render.render();
}

function togglePointerLock(input: Input): void {
  const locked = input.mouse.pointerLocked;
  const lockKey = "r";
  if (!locked && input.keys.pressed.has(lockKey)) {
    requestPointerLock();
  }
  else if (locked && input.keys.pressed.has(lockKey)) {
    exitPointerLock();
  }
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
    this.controllers = createControllers(entities, scene, this.physicsSystem);
  }

  runSimulationLoop = () => {
    this.processNextFrame();
    requestAnimationFrame(this.runSimulationLoop);
  };

  processNextFrame(): void {
    const dt = this.clock.getDelta();
    const input = this.inputListener.getInput();
    togglePointerLock(input);
    togglePlayerVisibility(this.entities, input);
    updatePrePhysicsControllers(dt, this.controllers, this.entities, input);
    this.stepSimulation(dt);
    updateUIAndRender(this.controllers, input);
  }

  private stepSimulation(dt: number): void {
    this.physicsSystem.step(dt, this.controllers.table.getArmBasePosition());
    syncGraphics(this.entities, this.physicsSystem.getRigidBodyMap());
  }

}

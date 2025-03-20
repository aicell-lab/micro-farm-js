import * as THREE from 'three';
import { PhysicsSystem } from '../physics/physicsSystem';
import { Input, InputListener } from '../io/input';
import { EntityCollection } from '../setup/entityCollection';
import { syncGraphics } from '../physics/physicsSync';
import { togglePlayerVisibility } from './playerOpacity';
import { UIMediator } from './uiMediator';
import { togglePointerLock } from '../io/input';
import { Controllers, createControllers } from '../ctrl/controllerFactory';

function updatePrePhysicsControllers(dt: number, ctrl: Controllers, entities: EntityCollection, input: Input): void {
  ctrl.camera.update(dt, input);
  ctrl.eventMediator.processActions(input, ctrl.ui.getArmEvent());
  ctrl.player.update(entities.getActors().player.object, dt);
  ctrl.table.update(dt);
}

export class SceneSystem {
  private physicsSystem: PhysicsSystem;
  private clock: THREE.Clock;
  private entities: EntityCollection;
  private controllers: Controllers;
  private inputListener: InputListener;
  private uiMediator: UIMediator;

  constructor(entities: EntityCollection, scene: THREE.Scene) {
    this.inputListener = new InputListener();
    this.entities = entities;
    this.physicsSystem = new PhysicsSystem(entities);
    this.clock = new THREE.Clock();
    this.controllers = createControllers(entities, scene, this.physicsSystem);
    this.uiMediator = new UIMediator(this.controllers.ui, this.controllers.dialog);
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
    this.uiMediator.update(input);
    this.controllers.render.render();
  }

  private stepSimulation(dt: number): void {
    this.physicsSystem.step(dt, this.controllers.table.getArmBasePosition());
    syncGraphics(this.entities, this.physicsSystem.getRigidBodyMap());
  }

}

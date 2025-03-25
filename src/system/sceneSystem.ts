import * as THREE from 'three';
import { PhysicsSystem } from '../physics/physicsSystem';
import { Input, InputListener } from '../io/input';
import { EntityCollection } from '../setup/entityCollection';
import { syncGraphics } from '../physics/physicsSync';
import { registerPlayerVisibilityToggle } from './playerOpacity';
import { UIMediator } from './uiMediator';
import { Controllers, createControllers } from '../ctrl/controllerFactory';
import { EventMediator } from '../ctrl/eventMediator';
import { renderScene } from './rendering';
import { createCamera } from './rendering';
import { keybind } from '../io/keybind';


export class SceneSystem {
  private physicsSystem: PhysicsSystem;
  private clock: THREE.Clock;
  private entities: EntityCollection;
  private controllers: Controllers;
  private inputListener: InputListener;
  private uiMediator: UIMediator;
  private eventMediator: EventMediator;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  constructor(entities: EntityCollection, scene: THREE.Scene) {
    this.camera = createCamera();
    this.scene = scene;
    this.inputListener = new InputListener();
    this.entities = entities;
    this.physicsSystem = new PhysicsSystem(entities);
    this.clock = new THREE.Clock();
    this.controllers = createControllers(entities, this.camera);
    this.uiMediator = new UIMediator(this.controllers.ui, this.controllers.dialog);
    this.eventMediator = new EventMediator(entities.getActors(), this.controllers.player, this.controllers.table, this.physicsSystem);
    registerPlayerVisibilityToggle(entities);
  }

  runSimulationLoop = () => {
    this.processFrame(this.clock.getDelta(), this.inputListener.getInput());
    requestAnimationFrame(this.runSimulationLoop);
  };

  processFrame(dt: number, input: Input): void {
    keybind.process(input);
    this.updatePrePhysicsControllers(dt, input);
    this.stepSimulation(dt);
    this.uiMediator.update(input);
    renderScene(this.scene, this.camera);
  }

  private stepSimulation(dt: number): void {
    this.physicsSystem.step(dt, this.controllers.table.getArmBasePosition());
    syncGraphics(this.entities, this.physicsSystem.getRigidBodyMap());
  }

  private updatePrePhysicsControllers(dt: number, input: Input): void {
    const ctrl = this.controllers;
    ctrl.camera.update(dt, input);
    this.eventMediator.processActions(input);
    ctrl.player.update(dt);
    ctrl.table.update(dt);
  }

}

import * as THREE from 'three';
import { PhysicsSystem } from '../physics/physicsSystem';
import { Input } from '../io/input';
import { InputListener } from '../io/inputListener';
import { EntityCollection } from '../setup/entityCollection';
import { syncGraphics } from '../physics/physicsSync';
import { registerPlayerVisibilityToggle } from './playerOpacity';
import { UIMediator } from '../ui/uiMediator';
import { Controllers, createControllers } from '../ctrl/controllerFactory';
import { EventMediator } from '../ctrl/eventMediator';
import { renderScene, createCamera } from './rendering';
import { keybind } from '../io/keybind';


export class SceneSystem {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private clock: THREE.Clock;
  private entities: EntityCollection;
  private controllers: Controllers;
  private inputListener: InputListener;
  private uiMediator: UIMediator;
  private eventMediator: EventMediator;
  private physicsSystem: PhysicsSystem;

  constructor(entities: EntityCollection, scene: THREE.Scene) {
    this.camera = createCamera();
    this.scene = scene;
    this.entities = entities;
    this.clock = new THREE.Clock();
    this.inputListener = new InputListener();
    this.physicsSystem = new PhysicsSystem(entities);
    this.controllers = createControllers(entities, this.camera);
    this.uiMediator = new UIMediator(this.controllers.ui, this.controllers.dialog);
    this.eventMediator = new EventMediator(entities.getActors(), this.controllers.player, this.controllers.table, this.physicsSystem);
    registerPlayerVisibilityToggle(entities);
  }

  runSimulationLoop = () => {
    const dt = this.clock.getDelta();
    this.processInput(dt, this.inputListener.getInput());
    this.processFrame(dt);
    requestAnimationFrame(this.runSimulationLoop);
  };

  private processInput(dt: number, input: Input): void {
    keybind.process(input);
    this.controllers.camera.update(dt, input);
    this.eventMediator.processActions(input);
    this.uiMediator.update(input);
  }

  private processFrame(dt: number): void {
    this.updateActors(dt);
    this.stepSimulation(dt);
    renderScene(this.scene, this.camera);
  }

  private updateActors(dt: number): void {
    const ctrl = this.controllers;
    ctrl.player.update(dt);
    ctrl.table.update(dt);
  }

  private stepSimulation(dt: number): void {
    this.physicsSystem.step(dt, this.controllers.table.getArmBasePosition());
    syncGraphics(this.entities, this.physicsSystem.getRigidBodyMap());
  }

}

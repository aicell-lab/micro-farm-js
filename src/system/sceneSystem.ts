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
import { Assets } from '../res/assets';
import { Animations } from '../setup/enums';

export class SceneSystem {
  private uiController: UIController;
  private actorController: ActorController;
  private cameraController: CameraController;
  private renderController: RenderController;
  private simulationLoop: SimulationLoop;
  private clock: THREE.Clock;

  private animationMixer?: THREE.AnimationMixer;

  constructor(room: Room, actors: Actors, scene: THREE.Scene, physicsWorld: PhysicsWorld) {
    this.cameraController = new CameraController(actors.player.object);
    let camera = this.cameraController.getCamera();
    this.uiController = new UIController(camera, room, actors);
    this.renderController = new RenderController(scene, camera);
    this.actorController = new ActorController(actors, new InputListener(this.uiController));
    this.simulationLoop = new SimulationLoop(room, actors, physicsWorld);
    this.clock = new THREE.Clock();
    this.loadAnimationTest(scene);
  }

  private loadAnimationTest(scene: THREE.Scene) {
    let animationAssets = Assets.getInstance().getAnimations();
    let animationAsset = animationAssets.get(Animations.Human)!;
    const model = animationAsset.model;
    const animations = animationAsset.animations;
    this.animationMixer = new THREE.AnimationMixer(model);
    animations.forEach((clip) => {
      this.animationMixer!.clipAction(clip).play();
    });
    scene.add(model);
  }

  runSimulationLoop = () => {
    this.processNextFrame();
    requestAnimationFrame(this.runSimulationLoop);
  };

  processNextFrame() {
    const dt = this.clock.getDelta();

    if (this.animationMixer) {
      this.animationMixer.update(dt);
    }

    this.cameraController.update(dt);
    this.actorController.handleUserInput();
    this.simulationLoop.step(dt);
    this.uiController.updateSpatialUI();
    this.renderController.render();
  }

}
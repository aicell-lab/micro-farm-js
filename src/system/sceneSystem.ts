import * as THREE from 'three';
import { SceneSetup } from '../types/setup'
import { Actor, Human } from './actor';
import { InputListener } from '../io/input';
import { setResizeListener } from './window';
import { CameraController } from './cameraController';
import { FLOOR_Y_POSITION } from '../setup/roomConstants';
import { SimulationLoop } from './simLoop';

export function setActorPosition(actor: Actor) {
  const boundingBox = new THREE.Box3().setFromObject(actor.mesh);
  const minY = boundingBox.min.y;
  if (minY < FLOOR_Y_POSITION) {
    actor.mesh.position.y -= minY;
  }
}

export class SceneSystem {

  private inputListener: InputListener;
  private cameraController: CameraController;
  private simLoop: SimulationLoop;

  constructor(sceneSetup: SceneSetup) {
    setResizeListener(sceneSetup);

    this.inputListener = new InputListener();
    
    let actor = new Human();
    sceneSetup.scene.add(actor.mesh);
    setActorPosition(actor);

    this.simLoop = new SimulationLoop(sceneSetup, actor);
    this.cameraController = new CameraController(sceneSetup.cameraSetup, actor);
  }

  simulationLoop = () => {
    let action = this.inputListener.getAction();
  
    this.cameraController.setOffset();
    this.simLoop.step(action);
    this.cameraController.update();

    requestAnimationFrame(this.simulationLoop);
  };

}
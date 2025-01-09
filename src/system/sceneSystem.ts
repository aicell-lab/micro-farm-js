import * as THREE from 'three';
import { Actor, Human } from './actor';
import { InputListener } from '../io/input';
import { setResizeListener } from './window';
import { CameraController } from './cameraController';
import { SimulationLoop } from './simLoop';
import { SceneSetup, FLOOR_Y_POSITION } from '../setup/room';

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

  constructor(sceneSetup: SceneSetup, cameraController: CameraController, human: Human) {
    setResizeListener(cameraController.getCameraSetup());
    this.inputListener = new InputListener();

    setActorPosition(human);

    this.simLoop = new SimulationLoop(sceneSetup, human);
    this.cameraController = cameraController;
  }

  simulationLoop = () => {
    let action = this.inputListener.getAction();
  
    this.cameraController.setOffset();
    this.simLoop.step(action, this.cameraController.getCamera());
    this.cameraController.update();

    requestAnimationFrame(this.simulationLoop);
  };

}
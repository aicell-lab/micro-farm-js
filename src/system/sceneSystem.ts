import * as THREE from 'three';
import { SceneSetup } from '../types/setup'
import { Actor, Human } from './actor';
import { InputListener } from '../io/input';
import { simLoopStep, SimState } from './simLoop';
import { FrameTime } from '../types/frameTime';
import { setResizeListener } from './window';
import { setStaticFurniturePositions } from '../setup/roomPositions';
import { CameraController } from './cameraController';
import { FLOOR_Y_POSITION } from '../setup/roomConstants';

export function setActorPosition(actor: Actor) {
  const boundingBox = new THREE.Box3().setFromObject(actor.mesh);
  const minY = boundingBox.min.y;
  if (minY < FLOOR_Y_POSITION) {
    actor.mesh.position.y -= minY;
  }
}

function getFrameTime(prevFrameTime?: FrameTime): FrameTime {
  const timestamp = performance.now();
  const delta = prevFrameTime ? (timestamp - prevFrameTime.timestamp) / 1000.0 : 0;
  return { delta, timestamp };
}

export class SceneSystem {

  private inputListener: InputListener;
  private sceneSetup: SceneSetup;
  private actor: Actor;
  private frameTime: FrameTime;
  private cameraController: CameraController;

  constructor(sceneSetup: SceneSetup) {
    setResizeListener(sceneSetup);
    this.sceneSetup = sceneSetup;
    this.inputListener = new InputListener();
    this.actor = new Human();
    this.sceneSetup.scene.add(this.actor.mesh);
    this.frameTime = getFrameTime();
    setStaticFurniturePositions(this.sceneSetup.room);
    setActorPosition(this.actor);
    this.cameraController = new CameraController(this.sceneSetup.cameraSetup, this.actor);
  }

  getSimState(): SimState {
    return { actor: this.actor, sceneSetup: this.sceneSetup }
  }

  simulationLoop = () => {
    const updatedFrameTime = getFrameTime(this.frameTime);
    let action = this.inputListener.getAction();

    this.cameraController.setOffset();
    simLoopStep(this.getSimState(), this.frameTime, action);
    this.cameraController.update();

    this.frameTime = updatedFrameTime
    requestAnimationFrame(this.simulationLoop);
  };

}
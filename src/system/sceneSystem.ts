import * as THREE from 'three';
import { SceneSetup } from '../types/setup'
import { Actor } from './actor';
import { InputListener } from '../io/input';
import { simLoopStep, getFrameTime, SimState } from './simLoop';
import { FrameTime } from '../types/frameTime';
import { setResizeListener } from './window';
import { setStaticFurniturePositions } from '../setup/roomPositions';

export function setActorPosition(actor: Actor) {
  const boundingBox = new THREE.Box3().setFromObject(actor.mesh);
  const minY = boundingBox.min.y;
  if (minY < 0) {
    actor.mesh.position.y -= minY;
  }
}

export class SceneSystem {

  private inputListener: InputListener;
  private sceneSetup: SceneSetup;
  private actor: Actor;
  private frameTime: FrameTime;
  private cameraOffset: THREE.Vector3;

  constructor(sceneSetup: SceneSetup) {
    setResizeListener(sceneSetup);
    this.sceneSetup = sceneSetup;
    this.inputListener = new InputListener();
    this.actor = new Actor();
    this.sceneSetup.scene.add(this.actor.mesh);
    this.frameTime = getFrameTime();
    setStaticFurniturePositions(this.sceneSetup.room);
    setActorPosition(this.actor);
    this.cameraOffset = this.sceneSetup.cameraSetup.camera.position.clone().sub(this.actor.mesh.position);
  }

  getSimState(): SimState {
    return { actor: this.actor, sceneSetup: this.sceneSetup, inputListener: this.inputListener, cameraOffset: this.cameraOffset }
  }

  simulationLoop = () => {
    const updatedFrameTime = getFrameTime(this.frameTime);
    simLoopStep(this.getSimState(), this.frameTime);
    this.frameTime = updatedFrameTime
    requestAnimationFrame(this.simulationLoop);
  };

}
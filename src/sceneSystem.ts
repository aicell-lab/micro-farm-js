import * as THREE from 'three';
import { SceneSetup } from './types/setup'
import { MathUtils } from 'three';
import { Actor } from './actor';
import { InputListener } from './input';
import { simLoopStep, getFrameTime, SimState } from './simLoop';
import { FrameTime } from './types/frameTime';
import { Models } from './types/models';

function setResizeListener(sceneSetup: SceneSetup) {
  window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    sceneSetup.renderer.setSize(width, height);
    sceneSetup.cameraSetup.camera.aspect = width / height;
    sceneSetup.cameraSetup.camera.updateProjectionMatrix();
    sceneSetup.cameraSetup.cameraCtrl.update();
  });
}

function setFloorPosition(object: THREE.Object3D) {
  const boundingBox = new THREE.Box3().setFromObject(object);
  const minY = boundingBox.min.y;
  if (minY < 0) {
    object.position.y -= minY;
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
    this.positionSceneObjects(this.sceneSetup);

    this.cameraOffset = this.sceneSetup.cameraSetup.camera.position.clone().sub(this.actor.mesh.position);
  }

  positionSceneObjects(sceneSetup: SceneSetup): void {
    setFloorPosition(this.actor.mesh);
    let table = sceneSetup.modelMap.get(Models.OpticalTable);
    if (table) {
      setFloorPosition(table);
      table.rotation.x = MathUtils.degToRad(0);
    }
  }

  getSimState(): SimState {
    return {actor: this.actor, sceneSetup: this.sceneSetup, inputListener: this.inputListener, frameTime: this.frameTime, cameraOffset: this.cameraOffset}
  }

  mainLoop = () => {
    this.frameTime = simLoopStep(this.getSimState());
    requestAnimationFrame(this.mainLoop);
  };

}
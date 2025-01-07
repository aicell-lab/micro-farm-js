import * as THREE from 'three';
import { SceneSetup } from './sceneSetup';
import { Models, FrameTime } from './core'
import { MathUtils } from 'three';
import { Actor } from './actor';
import { InputListener } from './input';
import { simLoopStep, getFrameTime, SimState } from './simLoop';

function setResizeListener(sceneSetup: SceneSetup) {
  window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    sceneSetup.renderer.setSize(width, height);
    sceneSetup.camera.aspect = width / height;
    sceneSetup.camera.updateProjectionMatrix();
    sceneSetup.cameraCtrl.update();
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

    this.cameraOffset = this.sceneSetup.camera.position.clone().sub(this.actor.mesh.position);
  }

  positionSceneObjects(sceneSetup: SceneSetup) {
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
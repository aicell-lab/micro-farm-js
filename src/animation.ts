import * as THREE from 'three';
import { SceneSetup } from './sceneSetup';
import { Models } from './models'
import { MathUtils } from 'three';
import { Actor } from './actor';
import { InputListener } from './input';

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

export class SceneSystem {

  private inputListener: InputListener;
  private sceneSetup: SceneSetup;
  private actor: Actor;

  constructor(sceneSetup: SceneSetup) {
    this.sceneSetup = sceneSetup;
    this.inputListener = new InputListener();
    this.actor = new Actor();
    this.sceneSetup.scene.add(this.actor.mesh);
    setResizeListener(sceneSetup);
  }

  actorUpdate() {
    const delta = 0.016;
    this.actor.applyAction(this.inputListener.getAction());
    this.actor.update(delta);
  }

  mainLoop = () => {
    this.actorUpdate();
    this.renderScene(this.sceneSetup);
    requestAnimationFrame(this.mainLoop);
  };

  renderScene(sceneSetup: SceneSetup) {
    let table = sceneSetup.modelMap.get(Models.OpticalTable);
    if (table) {
      const boundingBox = new THREE.Box3().setFromObject(table);
      const dimensions = new THREE.Vector3();
      boundingBox.getSize(dimensions);
      const tableMinY = boundingBox.min.y;
      if (tableMinY < 0) {
        table.position.y -= tableMinY;
      }
      table.rotation.x = MathUtils.degToRad(0);
    }
    sceneSetup.renderer.render(sceneSetup.scene, sceneSetup.camera);
  }

}
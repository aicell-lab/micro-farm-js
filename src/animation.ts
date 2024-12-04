import * as THREE from 'three';
import { SceneSetup } from './sceneSetup';
import { Models } from './models'
import { MathUtils } from 'three';
import { Actor } from './actor';
import { InputListener } from './input';

export function animate(sceneSetup: SceneSetup) {

  let inputListener = new InputListener();
  let actor = new Actor();

  let modelMap = sceneSetup.modelMap;
  let renderer = sceneSetup.renderer;
  let scene = sceneSetup.scene;
  let camera = sceneSetup.camera;
  let cameraCtrl = sceneSetup.cameraCtrl

  scene.add(actor.mesh);

  let boundingBoxHelper: any = null;

  window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    cameraCtrl.update();
  });

  var stateUpdate = function () {
    const delta = 0.016; 
    actor.applyAction(inputListener.getAction());
    actor.update(delta);
  }

  var draw = function () {
    let table = modelMap.get(Models.OpticalTable);
    if (table) {
      const boundingBox = new THREE.Box3().setFromObject(table);
      const dimensions = new THREE.Vector3();
      boundingBox.getSize(dimensions);
      const tableMinY = boundingBox.min.y;
      if (tableMinY < 0) {
        table.position.y -= tableMinY;
      }

      if (!boundingBoxHelper) {
        boundingBoxHelper = new THREE.BoxHelper(table, 0xffff00); // Yellow color for visibility
        scene.add(boundingBoxHelper);
      }

      boundingBoxHelper.update();
      boundingBoxHelper.rotation.copy(table.rotation);
    }

    if (table) {
      table.rotation.x = MathUtils.degToRad(0);
    }

    stateUpdate();
    renderer.render(scene, camera);

  };

  renderer.setAnimationLoop(draw);
}

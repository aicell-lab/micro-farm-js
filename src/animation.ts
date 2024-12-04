import * as THREE from 'three';
import { SceneSetup } from './sceneSetup';
import { Models } from './models'
import { toRadians } from './util';

export function animate(sceneSetup: SceneSetup) {

  let modelMap = sceneSetup.modelMap;
  let renderer = sceneSetup.renderer;
  let scene = sceneSetup.scene;
  let camera = sceneSetup.camera;
  let cameraCtrl = sceneSetup.cameraCtrl

  let boundingBoxHelper: any = null;

  window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    cameraCtrl.update();
  });

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
      table.rotation.x = toRadians(0);
    }
    renderer.render(scene, camera);
  };

  renderer.setAnimationLoop(draw);
}

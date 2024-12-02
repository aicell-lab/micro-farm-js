import * as THREE from 'three';
import { SceneSetup } from './sceneSetup';

export function animate(sceneSetup: SceneSetup) {

  let objects = sceneSetup.objects;
  let renderer = sceneSetup.renderer;
  let scene = sceneSetup.scene;
  let camera = sceneSetup.camera;

  var draw = function(){
    if (objects.length > 0) {
      let obj = objects[0];

      if (obj) {
        obj.rotation.x += 0.001;
        obj.rotation.y += 0.001;
      } else {
        console.warn('Object at objects[0] is undefined or null.');
      }

      renderer.render(scene, camera);
    } else {
      console.warn('No objects to animate.');
    }
  };

  renderer.setAnimationLoop(draw);
}

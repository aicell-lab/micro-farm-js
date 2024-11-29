import * as THREE from 'three';

export function animate(objects: THREE.Object3D[], scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {

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

import * as THREE from 'three';
import { CameraSetup } from '../setup/cameraSetup';

let rendererInstance: THREE.WebGLRenderer | null = null;

export function setResizeListener(cameraSetup: CameraSetup) {
  window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    getRenderer().setSize(width, height);
    cameraSetup.camera.aspect = width / height;
    cameraSetup.camera.updateProjectionMatrix();
    cameraSetup.cameraCtrl.update();
  });
}

export function getRenderer(): THREE.WebGLRenderer {
  if (!rendererInstance) {
    rendererInstance = new THREE.WebGLRenderer();
    rendererInstance.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(rendererInstance.domElement);
  }
  return rendererInstance;
}

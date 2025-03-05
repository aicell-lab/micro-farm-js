import * as THREE from 'three';

let rendererInstance: THREE.WebGLRenderer | null = null;

export function setResizeListener(camera: THREE.PerspectiveCamera) {
  window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    getRenderer().setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
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

export function requestPointerLock(): void {
  const canvas = document.body;
  if (canvas.requestPointerLock) {
    canvas.requestPointerLock();
  }
}

export function exitPointerLock(): void {
  if (document.pointerLockElement) {
    document.exitPointerLock();
  }
}

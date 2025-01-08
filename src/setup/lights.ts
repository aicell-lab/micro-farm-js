import * as THREE from 'three';

export function getLights(): THREE.Light[] {
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 5, 5).normalize();
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  return [dirLight, ambientLight];
}


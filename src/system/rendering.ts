import * as THREE from 'three';
import { getRenderer } from './window';

export function renderScene(scene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    getRenderer().render(scene, camera);
}

export function createCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);
    return camera
}

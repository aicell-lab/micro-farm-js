import * as THREE from 'three';
import { getRenderer } from '../system/window';

export class RenderController {

    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;

    constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
        this.scene = scene;
        this.camera = camera;
    }

    render() {
        getRenderer().render(this.scene, this.camera);
    }
}

export function createCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);
    return camera
}

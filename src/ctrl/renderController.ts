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
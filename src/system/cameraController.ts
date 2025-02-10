import * as THREE from 'three';
import { setResizeListener } from './window';
import { ThirdPersonCamera } from './thirdPersonCamera';

export class CameraController {
    private camera: THREE.PerspectiveCamera;
    private thirdPersonCamera: ThirdPersonCamera;

    constructor(target: THREE.Object3D) {
        this.camera = createCamera();
        setResizeListener(this.camera);
        this.thirdPersonCamera = new ThirdPersonCamera(this.camera, target);
    }


    public update(dt: number): void {
        this.thirdPersonCamera.update(dt);
    }

    getCamera(): THREE.PerspectiveCamera {
        return this.camera;
    }
}

function createCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);
    return camera
}
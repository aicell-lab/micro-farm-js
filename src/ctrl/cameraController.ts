import * as THREE from 'three';
import { setResizeListener } from '../system/window';
import { ThirdPersonCamera } from '../system/thirdPersonCamera';

export class CameraController {
    private camera: THREE.PerspectiveCamera;
    private thirdPersonCamera: ThirdPersonCamera;

    constructor(target: THREE.Object3D, camera: THREE.PerspectiveCamera) {
        this.camera = camera;
        setResizeListener(this.camera);
        this.thirdPersonCamera = new ThirdPersonCamera(this.camera, target);
    }

    public update(dt: number): void {
        this.thirdPersonCamera.update(dt);
    }
}


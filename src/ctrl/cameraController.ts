import * as THREE from 'three';
import { setResizeListener } from '../system/window';
import { ThirdPersonCamera } from '../system/thirdPersonCamera';
import { Input } from '../io/input';

export class CameraController {
    private camera: THREE.PerspectiveCamera;
    private thirdPersonCamera: ThirdPersonCamera;

    constructor(target: THREE.Object3D, camera: THREE.PerspectiveCamera) {
        this.camera = camera;
        setResizeListener(this.camera);
        this.thirdPersonCamera = new ThirdPersonCamera(this.camera, target);
    }

    public update(dt: number, input: Input): void {
        if (input.mouse.normalizedScrollDelta !== 0) {
            this.thirdPersonCamera.adjustZoom(input.mouse.normalizedScrollDelta);
        }
        this.thirdPersonCamera.update(dt);
    }
}


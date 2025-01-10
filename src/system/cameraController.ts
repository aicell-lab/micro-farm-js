import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { getRenderer } from './window';
import { CameraSetup } from '../setup/cameraSetup';
import { setResizeListener } from './window';

export class CameraController {
    private prevCameraOffset: THREE.Vector3;
    private target: THREE.Object3D;
    private cameraSetup: CameraSetup;

    constructor(target: THREE.Object3D) {
        this.cameraSetup = createCameraSetup();
        this.target = target;
        this.prevCameraOffset = this.getCameraOffset();
        setResizeListener(this.cameraSetup);
    }

    private getCameraOffset(): THREE.Vector3 {
        let camera = this.cameraSetup.camera;
        const cameraPosition = camera.position.clone();
        const targetPosition = this.target.position;
        return cameraPosition.sub(targetPosition);
    }

    private setPrevOffset(): void {
        this.prevCameraOffset = this.getCameraOffset();
    }

    private updateCamera(): void {
        let cPos = this.cameraSetup.camera.position;
        const tPos = this.target.position;
        cPos.copy(tPos.clone().add(this.prevCameraOffset));
        this.updateCameraCtrl();
    }

    private updateCameraCtrl(): void {
        const tPos = this.target.position;
        this.cameraSetup.cameraCtrl.target.copy(tPos);
        this.cameraSetup.cameraCtrl.update();
    }

    getCamera(): THREE.PerspectiveCamera {
        return this.cameraSetup.camera;
    }

    getCameraSetup(): CameraSetup {
        return this.cameraSetup;
    }

    executeWithOffsetHandling(callback: () => void): void {
        this.setPrevOffset();
        callback();
        this.updateCamera();
    }

}

function createCameraSetup(): CameraSetup {
    let camera = createCamera()
    return { camera: camera, cameraCtrl: new OrbitControls(camera, getRenderer().domElement) }
}

function createCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);
    return camera
}
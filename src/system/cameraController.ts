import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { getRenderer } from './window';
import { CameraSetup } from '../setup/cameraSetup';
import { setResizeListener } from './window';

export class CameraController {
    private cameraOffset: THREE.Vector3;
    private target: THREE.Object3D;
    private cameraSetup: CameraSetup;

    constructor(target: THREE.Object3D) {
        this.cameraSetup = createCameraSetup();
        this.cameraOffset = this.cameraSetup.camera.position.clone().sub(target.position);
        this.target = target;
        setResizeListener(this.cameraSetup);
    }

    setOffset(): void {
        let cameraSetup = this.cameraSetup;
        this.cameraOffset = cameraSetup.camera.position.clone().sub(this.target.position);
    }

    update(): void {
        this.cameraSetup.camera.position.copy(this.target.position.clone().add(this.cameraOffset));
        this.cameraSetup.cameraCtrl.target.copy(this.target.position);
        this.cameraSetup.cameraCtrl.update();
    }

    getCamera(): THREE.PerspectiveCamera {
        return this.cameraSetup.camera;
    }

    getCameraSetup(): CameraSetup {
        return this.cameraSetup;
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
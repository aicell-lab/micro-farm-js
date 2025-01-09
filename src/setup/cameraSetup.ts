import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export interface CameraSetup {
    camera: THREE.PerspectiveCamera;
    cameraCtrl: OrbitControls;
}

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export enum Models {
    OpticalTable
}

export interface FrameTime {
    delta: number;
    timestamp: number;
}

export interface CameraSetup {
  camera: THREE.PerspectiveCamera;
  cameraCtrl: OrbitControls;
}

export interface SceneSetup {
  scene: THREE.Scene;
  modelMap: Map<Models, THREE.Object3D>;
  renderer: THREE.WebGLRenderer;
  cameraSetup: CameraSetup
}

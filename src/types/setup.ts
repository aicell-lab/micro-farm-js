import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export interface CameraSetup {
  camera: THREE.PerspectiveCamera;
  cameraCtrl: OrbitControls;
}

export interface SceneSetup {
  scene: THREE.Scene;
  room: Room;
  renderer: THREE.WebGLRenderer;
  cameraSetup: CameraSetup;
}

export interface Room {
  floor: THREE.Object3D;
  opticalTable: THREE.Object3D;
}


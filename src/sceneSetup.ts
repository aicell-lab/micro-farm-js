import * as THREE from 'three';
import { FileCollections } from './assets';
import { Models, loadModels } from "./models"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function getCamera(): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  return camera
}

function getScene(): THREE.Scene {
  const scene = new THREE.Scene();
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5).normalize();
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);
  
  return scene
}

function getRenderer(): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  return renderer;
}

export class SceneSetup {
  scene: THREE.Scene;
  modelMap: Map<Models, THREE.Object3D>;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  cameraCtrl: OrbitControls;

  constructor(fileMaps: FileCollections) {
    this.scene = getScene();
    this.modelMap = loadModels(fileMaps);
    this.modelMap.forEach((value, _) => { this.scene.add(value); });
    this.renderer = getRenderer();
    this.camera = getCamera();
    this.cameraCtrl = new OrbitControls(this.camera, this.renderer.domElement);
  }

}

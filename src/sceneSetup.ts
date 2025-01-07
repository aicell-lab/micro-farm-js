import * as THREE from 'three';
import { FileCollections } from './res/assetTypes';
import { loadModels } from "./models"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { getLights, getFloor } from './roomExterior';
import { Models } from './core'

function getCamera(): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 5);
  return camera
}

function getScene(): THREE.Scene {
  const scene = new THREE.Scene();
  getLights().forEach((light) => scene.add(light));
  scene.add(getFloor());
  return scene
}

function getRenderer(): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  return renderer;
}

function getCameraSetup(renderer: THREE.WebGLRenderer): CameraSetup {
  let camera = getCamera()
  return { camera: camera, cameraCtrl: new OrbitControls(camera, renderer.domElement) }
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

export function getSceneSetup(files: FileCollections): SceneSetup {
  let scene = getScene();
  let modelMap = loadModels(files);
  modelMap.forEach((value, _) => { scene.add(value); });
  let renderer = getRenderer();
  let cameraSetup = getCameraSetup(renderer);
  return {scene: scene, modelMap: modelMap, renderer: renderer, cameraSetup: cameraSetup};
}

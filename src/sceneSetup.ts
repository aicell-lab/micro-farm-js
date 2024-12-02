import * as THREE from 'three';
import { FileCollections } from './assets';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { Models, modelFilepaths } from "./models"
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

  return scene
}

function getRenderer(): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  return renderer;
}

function applyStandardMaterial(obj: THREE.Object3D) {
  obj.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (!mesh.material) {
        mesh.material = new THREE.MeshStandardMaterial({ color: 0x888888 });
      }
    }
  });
}

function loadOBJ(collection: FileCollections, filepath: string): THREE.Object3D | null {
  const objFile = collection.textFiles.get(filepath);
  let obj = null;
  if (objFile) {
    const loader = new OBJLoader();
    obj = loader.parse(objFile);
    applyStandardMaterial(obj);
  }
  return obj;
}

function loadModels(collection: FileCollections): Map<Models,THREE.Object3D> {
  let modelMap: Map<Models,THREE.Object3D> = new Map();
  const keys: Models[] = [Models.OpticalTable];
  for (const key of keys){
    var obj = loadOBJ(collection, modelFilepaths[key]);
    if(obj)
      modelMap.set(key, obj);
  }
  return modelMap;
}

export class SceneSetup {
  scene: THREE.Scene;
  modelMap: Map<Models,THREE.Object3D>;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  cameraCtrl: OrbitControls;

  constructor(fileMaps: FileCollections){
    this.scene = getScene();
    this.modelMap = loadModels(fileMaps);
    this.modelMap.forEach((value, _) => { this.scene.add(value); });
    this.renderer = getRenderer();
    this.camera = getCamera();
    this.cameraCtrl = new OrbitControls( this.camera, this.renderer.domElement );
  }

}

import * as THREE from 'three';
import { FileCollections } from '../types/assetTypes';
import { loadModels } from "../res/modelLoader"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { getFloor } from './roomExterior';
import { getLights } from './lights';
import { SceneSetup, CameraSetup, Room } from '../types/setup'
import { Models } from '../types/models';

function getCamera(): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 5);
  return camera
}

function getRoom(files: FileCollections): Room {
  let modelMap = loadModels(files);
  let opticalTable = modelMap.get(Models.OpticalTable)!;
  return { floor: getFloor(), opticalTable: opticalTable };
}

function getScene(): THREE.Scene {
  const scene = new THREE.Scene();
  getLights().forEach((light) => scene.add(light));
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

function addRoomToScene(scene: THREE.Scene, room: Room): void {
  scene.add(room.floor);
  scene.add(room.opticalTable);
}

export function getSceneSetup(files: FileCollections): SceneSetup {
  let scene = getScene();
  let room = getRoom(files);
  addRoomToScene(scene, room);
  let renderer = getRenderer();
  let cameraSetup = getCameraSetup(renderer);
  return { scene: scene, room: room, renderer: renderer, cameraSetup: cameraSetup };
}

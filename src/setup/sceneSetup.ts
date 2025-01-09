import * as THREE from 'three';
import { FileCollections } from '../types/assetTypes';
import { loadModels } from "../res/modelLoader"
import { getFloor } from './roomExterior';
import { getLights } from './lights';
import { Models } from '../types/models';
import { setStaticFurniturePositions } from '../setup/roomPositions';
import { Room } from './room';

export interface SceneSetup {
  scene: THREE.Scene;
  room: Room;
  renderer: THREE.WebGLRenderer;
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

function addRoomToScene(scene: THREE.Scene, room: Room): void {
  scene.add(room.floor);
  scene.add(room.opticalTable);
}

export function getSceneSetup(files: FileCollections): SceneSetup {
  let scene = getScene();
  let room = getRoom(files);
  setStaticFurniturePositions(room);
  addRoomToScene(scene, room);
  let renderer = getRenderer();
  let sceneSetup = { scene: scene, room: room, renderer: renderer};
  return sceneSetup;
}

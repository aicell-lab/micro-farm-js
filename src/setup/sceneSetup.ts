import * as THREE from 'three';
import { getLights } from './lights';
import { Room } from './room';

export interface SceneSetup {
  scene: THREE.Scene;
  room: Room;
}

function getScene(): THREE.Scene {
  const scene = new THREE.Scene();
  getLights().forEach((light) => scene.add(light));
  return scene
}

function addRoomToScene(scene: THREE.Scene, room: Room): void {
  scene.add(room.floor);
  scene.add(room.opticalTable);
}

export function getSceneSetup(): SceneSetup {
  let scene = getScene();
  let room = new Room();
  addRoomToScene(scene, room);
  let sceneSetup = { scene: scene, room: room};
  return sceneSetup;
}

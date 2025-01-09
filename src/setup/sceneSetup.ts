import * as THREE from 'three';
import { getFloor } from './roomExterior';
import { getLights } from './lights';
import { Models } from '../types/models';
import { setStaticFurniturePositions } from '../setup/roomPositions';
import { Room } from './room';
import { Assets } from '../res/assets';

export interface SceneSetup {
  scene: THREE.Scene;
  room: Room;
}

function getRoom(): Room {
  let modelMap = Assets.getInstance().getModels();
  let opticalTable = modelMap.get(Models.OpticalTable)!;
  return { floor: getFloor(), opticalTable: opticalTable };
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
  let room = getRoom();
  setStaticFurniturePositions(room);
  addRoomToScene(scene, room);
  let sceneSetup = { scene: scene, room: room};
  return sceneSetup;
}

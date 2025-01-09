import * as THREE from 'three';
import { Assets } from '../res/assets';
import { Models } from '../types/models';
import { MathUtils } from 'three';
import { createNoise2D } from 'simplex-noise';

export const TABLE_ROTATION_DEGREES = 0;
export const FLOOR_Y_POSITION = 0;

function setFloorPosition(object: THREE.Object3D) {
    const boundingBox = new THREE.Box3().setFromObject(object);
    const minY = boundingBox.min.y;
    if (minY < FLOOR_Y_POSITION) {
        object.position.y -= minY;
    }
}

export class Room {
    floor: THREE.Object3D;
    opticalTable: THREE.Object3D;

    constructor() {
        let modelMap = Assets.getInstance().getModels();
        this.floor = createFloor();
        this.opticalTable = modelMap.get(Models.OpticalTable)!;
        this.setTablePosition();
    }

    private setTablePosition(): void {
        setFloorPosition(this.opticalTable);
        this.opticalTable.rotation.x = MathUtils.degToRad(TABLE_ROTATION_DEGREES);
    }

    addToScene(scene: THREE.Scene): void {
        scene.add(this.floor);
        scene.add(this.opticalTable);
    }
}

function createFloor(): THREE.Mesh {
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        const noise2D = createNoise2D();
        const scale = 0.01;
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const nx = x / canvas.width - 0.5;
                const ny = y / canvas.height - 0.5;
                const value = noise2D(nx / scale, ny / scale);
                const color = Math.floor((value + 1) * 127.5);
                ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);

    const floorMaterial = new THREE.MeshStandardMaterial({ map: texture });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    return floor;
}

export interface SceneSetup {
  scene: THREE.Scene;
  room: Room;
}

function getLights(): THREE.Light[] {
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 5, 5).normalize();
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  return [dirLight, ambientLight];
}

function getScene(): THREE.Scene {
  const scene = new THREE.Scene();
  getLights().forEach((light) => scene.add(light));
  return scene
}

export function getSceneSetup(): SceneSetup {
  let scene = getScene();
  let room = new Room();
  room.addToScene(scene);
  let sceneSetup = { scene: scene, room: room};
  return sceneSetup;
}


import * as THREE from 'three';
import { RoomObject } from '../object/roomObject';
import { RoomObjectFactory } from './roomObjectFactory';

export class Room {
    floor: RoomObject;
    opticalTable: RoomObject;

    constructor() {
        let factory = new RoomObjectFactory();
        this.floor = factory.createFloor();
        this.opticalTable = factory.createOpticalTable();
    }
}

function getLights(): THREE.Light[] {
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5).normalize();
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    return [dirLight, ambientLight];
}

export function createScene(): THREE.Scene {
    const scene = new THREE.Scene();
    getLights().forEach((light) => scene.add(light));
    return scene
}


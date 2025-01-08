import * as THREE from 'three';
import { MathUtils } from 'three';
import { Actor } from '../system/actor';
import { Room } from '../types/setup';

function setFloorPosition(object: THREE.Object3D) {
    const boundingBox = new THREE.Box3().setFromObject(object);
    const minY = boundingBox.min.y;
    if (minY < 0) {
        object.position.y -= minY;
    }
}

function setTablePosition(room: Room): void {
    let table = room.opticalTable;
    setFloorPosition(table);
    table.rotation.x = MathUtils.degToRad(0);
}

export function setStaticFurniturePositions(room: Room) {
    setTablePosition(room);
}



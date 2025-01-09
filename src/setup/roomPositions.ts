import * as THREE from 'three';
import { MathUtils } from 'three';
import {TABLE_ROTATION_DEGREES, FLOOR_Y_POSITION} from './roomConstants'
import { Room } from './room';

function setFloorPosition(object: THREE.Object3D) {
    const boundingBox = new THREE.Box3().setFromObject(object);
    const minY = boundingBox.min.y;
    if (minY < FLOOR_Y_POSITION) {
        object.position.y -= minY;
    }
}

function setTablePosition(room: Room): void {
    let table = room.opticalTable;
    setFloorPosition(table);
    table.rotation.x = MathUtils.degToRad(TABLE_ROTATION_DEGREES);
}

export function setStaticFurniturePositions(room: Room) {
    setTablePosition(room);
}



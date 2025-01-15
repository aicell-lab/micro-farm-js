import * as THREE from 'three';
import { FLOOR_Y_POSITION, TABLE_ROTATION_DEGREES } from "./constants";
import { RoomObject } from '../object/roomObject';
import { OpticalTable } from '../object/opticalTable';
import { Floor } from '../object/floor';
import { MathUtils } from 'three';
import { Room } from './room';


export class RoomObjectFactory {

    constructor() {

    }

    createFloor(): RoomObject {
        return new Floor();
    }

    createOpticalTable(): RoomObject {
        let table = new OpticalTable();
        setFloorPosition(table.object);
        table.object.rotation.x = MathUtils.degToRad(TABLE_ROTATION_DEGREES);
        return table;
    }

    createRoom(): Room {
        return {
            floor: this.createFloor(), opticalTable: this.createOpticalTable()
        }
    }

}

function setFloorPosition(object: THREE.Object3D) {
    const boundingBox = new THREE.Box3().setFromObject(object);
    const minY = boundingBox.min.y;
    if (minY < FLOOR_Y_POSITION) {
        object.position.y -= minY;
    }
}

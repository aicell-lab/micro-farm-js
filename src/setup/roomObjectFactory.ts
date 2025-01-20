//import * as THREE from 'three';
//import { FLOOR_Y_POSITION, TABLE_ROTATION_DEGREES } from "./constants";
//import { OpticalTable } from '../object/opticalTable';
//import { MathUtils } from 'three';
import { RoomObject } from '../object/roomObject';
import { Floor } from '../object/floor';
import { Room } from './room';


export class RoomObjectFactory {

    constructor() {

    }

    createFloor(): RoomObject {
        return new Floor();
    }

    /*createOpticalTable(): RoomObject {
        let table = new OpticalTable();
        setFloorPosition(table.object);
        table.object.rotation.x = MathUtils.degToRad(TABLE_ROTATION_DEGREES);
        return table;
    }*/

    createRoom(): Room {
        return {
            floor: this.createFloor()
        }
    }

}

/*function setFloorPosition(object: THREE.Object3D) {
    const boundingBox = new THREE.Box3().setFromObject(object);
    const minY = boundingBox.min.y;
    if (minY < FLOOR_Y_POSITION) {
        object.position.y -= minY;
    }
}*/


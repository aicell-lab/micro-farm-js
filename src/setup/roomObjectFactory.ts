import { RoomObject } from '../object/roomObject';
import { Floor } from '../object/floor';
import { Room } from './room';
import { TCube } from '../object/cube';

export class RoomObjectFactory {

    constructor() {

    }

    createFloor(): RoomObject {
        return new Floor();
    }

    createCube(): RoomObject {
        return new TCube();
    }

    createRoom(): Room {
        return {
            floor: this.createFloor(),
            cube: this.createCube()
        }
    }

}


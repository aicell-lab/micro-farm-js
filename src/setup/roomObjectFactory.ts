import { RoomObject } from '../object/roomObject';
import { Floor } from '../object/floor';
import { Room } from './room';

export class RoomObjectFactory {

    constructor() {

    }

    createFloor(): RoomObject {
        return new Floor();
    }

    createRoom(): Room {
        return {
            floor: this.createFloor()
        }
    }

}


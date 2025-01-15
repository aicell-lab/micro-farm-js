import { RoomObject } from '../object/roomObject';
import { RoomObjectFactory } from './roomObjectFactory';

export interface Room {
    floor: RoomObject;
    opticalTable: RoomObject;
}

export function createRoom() {
    let factory = new RoomObjectFactory();
    return {
        floor: factory.createFloor(), opticalTable: factory.createOpticalTable()
    }
}
